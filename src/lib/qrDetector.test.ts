import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    isSecureCameraContext,
    getNativeBarcodeDetector,
    resetNativeDetectorCache,
    detectQrFromSource,
} from './qrDetector';
import jsQR from 'jsqr';

vi.mock('jsqr', () => ({
    default: vi.fn(),
}));

describe('qrDetector', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        resetNativeDetectorCache();
        vi.clearAllMocks();
    });

    afterEach(() => {
        delete (window as unknown as { BarcodeDetector?: unknown }).BarcodeDetector;
    });

    describe('isSecureCameraContext', () => {
        it('returns true when window.isSecureContext is true', () => {
            Object.defineProperty(window, 'isSecureContext', {
                value: true,
                configurable: true,
            });
            expect(isSecureCameraContext()).toBe(true);
        });

        it('returns true for localhost even if isSecureContext is false', () => {
            Object.defineProperty(window, 'isSecureContext', {
                value: false,
                configurable: true,
            });
            Object.defineProperty(window, 'location', {
                value: { ...originalLocation, hostname: 'localhost' },
                configurable: true,
            });
            expect(isSecureCameraContext()).toBe(true);
        });

        it('returns true for 127.0.0.1', () => {
            Object.defineProperty(window, 'isSecureContext', {
                value: false,
                configurable: true,
            });
            Object.defineProperty(window, 'location', {
                value: { ...originalLocation, hostname: '127.0.0.1' },
                configurable: true,
            });
            expect(isSecureCameraContext()).toBe(true);
        });

        it('returns false for LAN IP like 192.168.100.2 when isSecureContext is false', () => {
            Object.defineProperty(window, 'isSecureContext', {
                value: false,
                configurable: true,
            });
            Object.defineProperty(window, 'location', {
                value: { ...originalLocation, hostname: '192.168.100.2' },
                configurable: true,
            });
            expect(isSecureCameraContext()).toBe(false);
        });
    });

    describe('getNativeBarcodeDetector', () => {
        it('returns null when BarcodeDetector is not defined in window', () => {
            expect(getNativeBarcodeDetector()).toBeNull();
        });

        it('instantiates and caches BarcodeDetector when available', () => {
            const mockDetect = vi.fn();
            class MockDetector {
                constructor(public options: unknown) {}
                detect = mockDetect;
            }

            window.BarcodeDetector = MockDetector as unknown as typeof window.BarcodeDetector;
            const detector = getNativeBarcodeDetector();
            expect(detector).not.toBeNull();

            // Caching check
            const secondCall = getNativeBarcodeDetector();
            expect(secondCall).toBe(detector);
        });
    });

    describe('detectQrFromSource with native BarcodeDetector', () => {
        it('detects and parses Bulgarian receipt using native BarcodeDetector', async () => {
            const mockDetect = vi.fn().mockResolvedValue([
                {
                    rawValue: '12345678*0001*2026-09-17*14:30:00*45.50',
                    format: 'qr_code',
                },
            ]);

            class MockDetector {
                detect = mockDetect;
            }

            window.BarcodeDetector = MockDetector as unknown as typeof window.BarcodeDetector;

            const mockVideo = {
                videoWidth: 1280,
                videoHeight: 720,
            } as unknown as HTMLVideoElement;

            const result = await detectQrFromSource(mockVideo);
            expect(result).not.toBeNull();
            expect(result?.amount).toBe(45.5);
            expect(result?.date).toBe('2026-09-17');
            expect(mockDetect).toHaveBeenCalledWith(mockVideo);
        });

        it('iterates through multiple barcodes if the first is unparseable', async () => {
            const mockDetect = vi.fn().mockResolvedValue([
                {
                    rawValue: '3800000100018', // Product EAN-13 barcode
                    format: 'ean_13',
                },
                {
                    rawValue: 'BG11122233*5544*2026-09-19*11:20:00*99.90', // Valid NRA QR
                    format: 'qr_code',
                },
            ]);

            class MockDetector {
                detect = mockDetect;
            }

            window.BarcodeDetector = MockDetector as unknown as typeof window.BarcodeDetector;

            const mockVideo = {
                videoWidth: 1280,
                videoHeight: 720,
            } as unknown as HTMLVideoElement;

            const result = await detectQrFromSource(mockVideo);
            expect(result).not.toBeNull();
            expect(result?.amount).toBe(99.9);
            expect(result?.date).toBe('2026-09-19');
        });
    });

    describe('detectQrFromSource with jsQR fallback', () => {
        it('returns null if dimensions are 0', async () => {
            const mockVideo = {
                videoWidth: 0,
                videoHeight: 0,
            } as unknown as HTMLVideoElement;

            const result = await detectQrFromSource(mockVideo);
            expect(result).toBeNull();
        });

        it('downscales frame larger than 640px and parses via jsQR', async () => {
            const mockCtx = {
                drawImage: vi.fn(),
                getImageData: vi.fn().mockReturnValue({
                    data: new Uint8ClampedArray(640 * 360 * 4),
                    width: 640,
                    height: 360,
                }),
            };

            const mockCanvas = {
                width: 0,
                height: 0,
                getContext: vi.fn().mockReturnValue(mockCtx),
            } as unknown as HTMLCanvasElement;

            const mockVideo = {
                videoWidth: 1280,
                videoHeight: 720,
            } as unknown as HTMLVideoElement;

            vi.mocked(jsQR).mockReturnValue({
                data: 'BG12345678*9876*2026-09-18*09:15:00*18.90',
            } as ReturnType<typeof jsQR>);

            const result = await detectQrFromSource(mockVideo, mockCanvas);
            expect(result).not.toBeNull();
            expect(result?.amount).toBe(18.9);
            expect(result?.date).toBe('2026-09-18');

            // Verify downscaling to 640x360
            expect(mockCanvas.width).toBe(640);
            expect(mockCanvas.height).toBe(360);
            expect(mockCtx.drawImage).toHaveBeenCalledWith(mockVideo, 0, 0, 640, 360);
        });
    });
});
