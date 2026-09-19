'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, Image as ImageIcon, X, AlertCircle, FileText, Check } from 'lucide-react';
import { ParsedReceiptQr } from '@/lib/qrParser';
import { detectQrFromSource, isSecureCameraContext } from '@/lib/qrDetector';

interface QrScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (parsed: ParsedReceiptQr) => void;
}

type ScannerTab = 'camera' | 'upload';
type CameraState = 'initializing' | 'active' | 'error';

const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (
        window.innerWidth < 640 ||
        /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
};

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
    const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [activeTab, setActiveTab] = useState<ScannerTab>('camera');
    const [cameraState, setCameraState] = useState<CameraState>('initializing');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [scanConfirmed, setScanConfirmed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Stop camera video stream and scan loop
    const stopCamera = useCallback(() => {
        isScanningRef.current = false;
        if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
        }
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
        setCameraState('initializing');
    }, []);

    const handleParsedResult = useCallback(
        (parsed: ParsedReceiptQr) => {
            setScanConfirmed(true);
            setTimeout(() => {
                stopCamera();
                onScanSuccess(parsed);
                setScanConfirmed(false);
            }, 250);
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

    // Start camera stream with multi-tier fallback and 6-second timeout
    const startCamera = useCallback(async () => {
        setCameraError(null);
        setInlineError(null);
        setCameraState('initializing');

        if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
        }

        // 6-second timeout: if camera hardware fails or user stalls on permission prompt
        cameraTimeoutRef.current = setTimeout(() => {
            setCameraError('Връзката с камерата отне твърде много време или не беше открита.');
            setCameraState('error');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        }, 6000);

        if (!isSecureCameraContext()) {
            if (cameraTimeoutRef.current) clearTimeout(cameraTimeoutRef.current);
            setCameraError(
                'Браузърът изисква защитена връзка (HTTPS) за достъп до камерата от телефон. Отворете сайта през HTTPS или качете снимка от таба „Качване на файл“.'
            );
            setCameraState('error');
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (cameraTimeoutRef.current) clearTimeout(cameraTimeoutRef.current);
            setCameraError('Камерата не се поддържа от този браузър.');
            setCameraState('error');
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
                    if (cameraTimeoutRef.current) clearTimeout(cameraTimeoutRef.current);
                    const error = err as Error;
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        setCameraError('Достъпът до камерата е отказан.');
                    } else {
                        setCameraError('Не беше намерена камера на това устройство.');
                    }
                    setCameraState('error');
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
                if (cameraTimeoutRef.current) {
                    clearTimeout(cameraTimeoutRef.current);
                    cameraTimeoutRef.current = null;
                }
                setCameraState('active');
                animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
            } catch {
                if (cameraTimeoutRef.current) clearTimeout(cameraTimeoutRef.current);
                setCameraError('Грешка при възпроизвеждане на видеото от камерата.');
                setCameraState('error');
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
            const mobile = isMobileDevice();
            setIsMobile(mobile);
            if (mobile) {
                setActiveTab('camera');
                startCamera();
            } else {
                setActiveTab('upload');
            }
        } else {
            stopCamera();
            setInlineError(null);
            setCameraError(null);
            setIsDragOver(false);
            setScanConfirmed(false);
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, startCamera, stopCamera]);

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
                {/* Global persistent file input */}
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

                {/* Main View Area */}
                <div className="p-4">
                    {/* CAMERA MODE */}
                    {activeTab === 'camera' && (
                        <div className="relative aspect-square w-full bg-stone-950 rounded-xl overflow-hidden border border-stone-800">
                            {/* Live Video Feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                    cameraState === 'active' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            />

                            {/* Viewfinder Overlay with Optical Framing */}
                            {cameraState === 'active' && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div
                                        className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl border transition-all duration-200 ${
                                            scanConfirmed
                                                ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)] bg-emerald-950/20'
                                                : 'border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]'
                                        }`}
                                    >
                                        {/* Optical Corners */}
                                        <div className={`absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 rounded-tl-md transition-colors ${scanConfirmed ? 'border-emerald-300' : 'border-emerald-400'}`} />
                                        <div className={`absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 rounded-tr-md transition-colors ${scanConfirmed ? 'border-emerald-300' : 'border-emerald-400'}`} />
                                        <div className={`absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 rounded-bl-md transition-colors ${scanConfirmed ? 'border-emerald-300' : 'border-emerald-400'}`} />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-2 border-r-2 rounded-br-md transition-colors ${scanConfirmed ? 'border-emerald-300' : 'border-emerald-400'}`} />

                                        {/* Scan line */}
                                        {!scanConfirmed && (
                                            <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-scanline" />
                                        )}

                                        {/* Scan Success Confirmation Pulse */}
                                        {scanConfirmed && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-150">
                                                <div className="w-12 h-12 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                                    <Check size={26} className="stroke-[3]" />
                                                </div>
                                                <span className="text-xs font-bold text-emerald-300 mt-2 tracking-wide drop-shadow-md">
                                                    Разчетено!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Floating Gallery Quick Action Button over Camera */}
                            {cameraState === 'active' && !scanConfirmed && (
                                <div className="absolute inset-x-0 bottom-3.5 flex items-center justify-center pointer-events-none z-10">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/85 hover:bg-stone-900 text-stone-100 border border-white/15 backdrop-blur-md shadow-lg text-xs font-medium active:scale-[0.97] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                                    >
                                        <ImageIcon size={14} className="text-emerald-400" />
                                        <span>Избери от галерия</span>
                                    </button>
                                </div>
                            )}

                            {/* Camera Seeking / Initializing Animation */}
                            {cameraState === 'initializing' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-stone-950/95 animate-in fade-in duration-200">
                                    <div className="relative mb-3.5 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 shadow-inner">
                                            <Camera size={20} className="animate-pulse" />
                                        </div>
                                        <div className="absolute -inset-1 rounded-2xl border-2 border-emerald-500/30 animate-ping pointer-events-none" />
                                    </div>
                                    <p className="text-xs font-semibold text-stone-200 mb-1">Свързване с камерата...</p>
                                    <p className="text-[11px] text-stone-400 max-w-[220px] leading-relaxed">
                                        Ако браузърът поиска разрешение, натиснете „Разреши“
                                    </p>
                                </div>
                            )}

                            {/* Camera Error / Not Found Fallback */}
                            {cameraState === 'error' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-stone-950 animate-in fade-in duration-200">
                                    <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 mb-3 shadow-inner">
                                        <CameraOff size={20} className="text-rose-400/80" />
                                    </div>
                                    <p className="text-xs font-semibold text-stone-200 mb-1">
                                        {cameraError || 'Камерата не беше открита'}
                                    </p>
                                    <p className="text-[11px] text-stone-400 max-w-[240px] leading-relaxed mb-3.5">
                                        Можете да опитате отново или да изберете снимка на касовия бон от галерията.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-750 border border-stone-700 px-3 py-1.5 rounded-lg active:scale-[0.97] transition-all cursor-pointer"
                                        >
                                            Опитай отново
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 px-3 py-1.5 rounded-lg active:scale-[0.97] transition-all cursor-pointer"
                                        >
                                            Избери от галерия
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* UPLOAD / FILE PICKER MODE */}
                    {activeTab === 'upload' && (
                        <>
                            {isMobile ? (
                                /* Mobile-tailored gallery picker card (no drag-and-drop confusion) */
                                <div className="relative aspect-square w-full rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-stone-800 bg-stone-950">
                                    <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-emerald-400 border border-stone-800 mb-3 shadow-inner">
                                        <ImageIcon size={22} />
                                    </div>
                                    <p className="text-xs font-semibold text-stone-200 mb-1">
                                        {cameraError ? 'Камерата не е достъпна' : 'Снимка на касов бон'}
                                    </p>
                                    <p className="text-[11px] text-stone-400 max-w-[240px] leading-relaxed mb-4">
                                        {cameraError || 'Изберете снимка на касова бележка от галерията на телефона'}
                                    </p>
                                    <div className="flex flex-col gap-2 w-full max-w-[220px]">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-md cursor-pointer"
                                        >
                                            <ImageIcon size={15} />
                                            <span>Отвори галерията</span>
                                        </button>
                                        {cameraError && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab('camera');
                                                    startCamera();
                                                }}
                                                className="w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium border border-stone-700 active:scale-[0.97] transition-all cursor-pointer"
                                            >
                                                Опитай отново с камера
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Desktop Drag & Drop dropzone with Ctrl+V and webcam toggle */
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
                                    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-400 border border-stone-800 mb-2.5">
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

                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-medium text-stone-300 transition-colors mb-3">
                                        <span>Поддържа се и поставяне с</span>
                                        <kbd className="font-mono text-stone-200 bg-stone-700/80 px-1.5 py-0.5 rounded text-[10px]">Ctrl+V</kbd>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveTab('camera');
                                            startCamera();
                                        }}
                                        className="text-[11px] text-stone-400 hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Или сканирайте с уебкамера
                                    </button>
                                </div>
                            )}
                        </>
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
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700/80 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <ImageIcon size={13} className="text-emerald-400" />
                        <span>Избери от галерия</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-3.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 text-xs font-medium active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Затвори
                    </button>
                </div>
            </div>
        </div>
    );
};
