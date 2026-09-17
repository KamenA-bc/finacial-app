'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Image as ImageIcon, X, AlertCircle, UploadCloud, FileText } from 'lucide-react';
import { ParsedReceiptQr } from '@/lib/qrParser';
import { detectQrFromSource, isSecureCameraContext } from '@/lib/qrDetector';

interface QrScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (parsed: ParsedReceiptQr) => void;
}

type ScannerTab = 'camera' | 'upload';

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
    isOpen,
    onClose,
    onScanSuccess,
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isScanningRef = useRef(false);

    const [activeTab, setActiveTab] = useState<ScannerTab>('camera');
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    // Stop camera video stream and scan loop
    const stopCamera = useCallback(() => {
        isScanningRef.current = false;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.onloadedmetadata = null;
            videoRef.current.srcObject = null;
        }
        if (canvasRef.current) {
            canvasRef.current.width = 0;
            canvasRef.current.height = 0;
            canvasRef.current = null;
        }
        setCameraActive(false);
    }, []);

    const handleParsedResult = useCallback(
        (parsed: ParsedReceiptQr) => {
            stopCamera();
            onScanSuccess(parsed);
        },
        [onScanSuccess, stopCamera]
    );

    // Continuous frame scanning loop on video stream
    const scanVideoFrame = useCallback(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
            animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
            return;
        }

        if (!isScanningRef.current) {
            isScanningRef.current = true;
            try {
                const parsed = await detectQrFromSource(video, canvasRef.current || undefined);
                if (parsed) {
                    handleParsedResult(parsed);
                    isScanningRef.current = false;
                    return;
                }
            } catch {
                // Ignore per-frame detector error and continue scanning
            } finally {
                isScanningRef.current = false;
            }
        }

        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
    }, [handleParsedResult]);

    // Start camera stream with multi-tier fallback for mobile devices
    const startCamera = useCallback(async () => {
        setCameraError(null);
        setInlineError(null);

        if (!isSecureCameraContext()) {
            setCameraError(
                'Браузърът изисква защитена връзка (HTTPS) за достъп до камерата от телефон. Отворете сайта през HTTPS или качете снимка от таба „Качване на файл“.'
            );
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError('Камерата не се поддържа от този браузър.');
            return;
        }

        let stream: MediaStream | null = null;
        try {
            // Tier 1: Ideal back camera with 720p/1080p
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                },
                audio: false,
            });
        } catch {
            try {
                // Tier 2: Basic environment facingMode
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });
            } catch {
                try {
                    // Tier 3: Any available camera stream
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                } catch (err) {
                    const error = err as Error;
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        setCameraError('Достъпът до камерата е отказан.');
                    } else {
                        setCameraError('Не беше намерена камера на това устройство.');
                    }
                    setCameraActive(false);
                    return;
                }
            }
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;

        const onPlay = async () => {
            try {
                await video.play();
                setCameraActive(true);
                animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
            } catch {
                setCameraError('Грешка при възпроизвеждане на видеото от камерата.');
                setCameraActive(false);
            }
        };

        if (video.readyState >= video.HAVE_METADATA) {
            await onPlay();
        } else {
            video.onloadedmetadata = () => {
                void onPlay();
            };
        }
    }, [scanVideoFrame]);

    // Process an image file from file picker, drag & drop, or clipboard paste
    const processImageFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) {
                setInlineError('Моля, изберете валиден файл с изображение.');
                return;
            }

            setInlineError(null);
            setIsProcessingImage(true);

            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = async () => {
                    try {
                        const parsed = await detectQrFromSource(img, canvasRef.current || undefined);
                        if (parsed) {
                            handleParsedResult(parsed);
                        } else {
                            setInlineError(
                                'Не беше открит валиден QR код за касова бележка. Моля, уверете се, че кодът е ясен и опитайте отново.'
                            );
                        }
                    } catch {
                        setInlineError('Грешка при разчитането на изображението.');
                    } finally {
                        setIsProcessingImage(false);
                    }
                };
                img.onerror = () => {
                    setInlineError('Файлът не може да бъде зареден като изображение.');
                    setIsProcessingImage(false);
                };
                img.src = reader.result as string;
            };
            reader.onerror = () => {
                setInlineError('Грешка при четене на файла.');
                setIsProcessingImage(false);
            };
            reader.readAsDataURL(file);
        },
        [handleParsedResult]
    );

    // Lifecycle
    useEffect(() => {
        if (isOpen) {
            setActiveTab('camera');
            startCamera();
        } else {
            stopCamera();
            setInlineError(null);
            setCameraError(null);
            setIsDragOver(false);
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, startCamera, stopCamera]);

    // Handle tab toggle
    const handleSwitchTab = (tab: ScannerTab) => {
        setActiveTab(tab);
        setInlineError(null);
        if (tab === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
    };

    // Keyboard controls: ESC to close, Ctrl+V to paste screenshot
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    if (file) {
                        processImageFile(file);
                        break;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
        };
    }, [isOpen, onClose, processImageFile]);

    // Drag & Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            {/* Soft Ambient Backdrop */}
            <div
                className="absolute inset-0 bg-stone-950/75 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog Card */}
            <div className="relative bg-stone-900 border border-stone-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-stone-100 rounded-2xl w-full max-w-sm sm:max-w-md overflow-hidden flex flex-col z-10 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-800/80 bg-stone-900/60">
                    <div>
                        <h3 className="text-sm font-semibold text-stone-100">Сканиране на бележка</h3>
                        <p className="text-[11px] text-stone-400">Разчитане на дата и сума от QR код</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
                        aria-label="Затвори"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Sub-Header: Segmented Switcher (Camera vs File) */}
                <div className="px-4 pt-3 pb-1 flex gap-1 bg-stone-900">
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('camera')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            activeTab === 'camera'
                                ? 'bg-stone-800 text-emerald-400 shadow-xs'
                                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                        }`}
                    >
                        <Camera size={13} />
                        <span>Камера</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSwitchTab('upload')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            activeTab === 'upload'
                                ? 'bg-stone-800 text-emerald-400 shadow-xs'
                                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                        }`}
                    >
                        <UploadCloud size={13} />
                        <span>Качване на файл</span>
                    </button>
                </div>

                {/* Main View Area */}
                <div className="p-4">
                    {/* CAMERA TAB */}
                    {activeTab === 'camera' && (
                        <div className="relative aspect-square w-full bg-stone-950 rounded-xl overflow-hidden flex items-center justify-center border border-stone-800">
                            {/* Live Video Feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transition-opacity duration-200 ${
                                    cameraActive ? 'opacity-100' : 'opacity-0'
                                }`}
                            />

                            {/* Viewfinder Overlay with Optical Framing */}
                            {cameraActive && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl border border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                                        {/* Optical Corners */}
                                        <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                                        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                                        <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />

                                        {/* Scan line */}
                                        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-scanline" />
                                    </div>
                                </div>
                            )}

                            {/* Camera starting or fallback prompt */}
                            {!cameraActive && (
                                <div className="p-6 text-center text-stone-400 flex flex-col items-center justify-center gap-2.5 h-full">
                                    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-500 border border-stone-800">
                                        <Camera size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-stone-200 mb-1">
                                            {cameraError || 'Стартиране на камерата...'}
                                        </p>
                                        <p className="text-[11px] text-stone-400 max-w-[240px] leading-relaxed">
                                            Можете да сканирате от телефон с камера или да качите снимка от таба „Качване на файл“.
                                        </p>
                                    </div>
                                    {cameraError && (
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="mt-1 text-xs font-medium text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 transition-colors cursor-pointer"
                                        >
                                            Опитай отново
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* UPLOAD DROPZONE TAB (Desktop & Gallery) */}
                    {activeTab === 'upload' && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative aspect-square w-full rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-6 border transition-all cursor-pointer ${
                                isDragOver
                                    ? 'border-emerald-500/80 bg-stone-950 text-emerald-300'
                                    : 'border-stone-800 bg-stone-950 hover:border-stone-700 text-stone-300'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) processImageFile(file);
                                    e.target.value = '';
                                }}
                            />

                            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-500 border border-stone-800 mb-2.5">
                                <FileText size={18} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-stone-200 mb-1">
                                    Изберете снимка на касова бележка
                                </p>
                                <p className="text-[11px] text-stone-400 max-w-[240px] leading-relaxed mb-3">
                                    Кликнете тук или провлачете файл от компютъра
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-medium text-stone-300 transition-colors">
                                <span>Поддържа се и поставяне с</span>
                                <kbd className="font-mono text-stone-200 bg-stone-700/80 px-1.5 py-0.5 rounded text-[10px]">Ctrl+V</kbd>
                            </div>
                        </div>
                    )}

                    {/* Loading Overlay during processing */}
                    {isProcessingImage && (
                        <div className="mt-2.5 py-2 px-3 bg-stone-800/80 border border-stone-700 rounded-xl flex items-center justify-center gap-2 text-xs text-stone-300 animate-in fade-in duration-150">
                            <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            <span>Разчитане на данните от QR кода...</span>
                        </div>
                    )}

                    {/* Subtle Inline Error Message */}
                    {inlineError && !isProcessingImage && (
                        <div className="mt-2.5 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-2 text-amber-200 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                            <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-400" />
                            <span className="leading-snug text-[11px]">{inlineError}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-stone-800/80 bg-stone-900/60 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700/80 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <ImageIcon size={13} className="text-stone-400" />
                        <span>Избери от галерия</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-3.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 text-xs font-medium transition-colors cursor-pointer"
                    >
                        Затвори
                    </button>
                </div>
            </div>
        </div>
    );
};
