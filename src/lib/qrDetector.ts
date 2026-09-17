import jsQR from 'jsqr';
import { parseReceiptQr, ParsedReceiptQr } from './qrParser';

export interface BarcodeDetectorInstance {
    detect(source: ImageBitmapSource): Promise<Array<{ rawValue: string; format?: string }>>;
}

export interface BarcodeDetectorConstructor {
    new (options?: { formats?: string[] }): BarcodeDetectorInstance;
    getSupportedFormats?: () => Promise<string[]>;
}

declare global {
    interface Window {
        BarcodeDetector?: BarcodeDetectorConstructor;
    }
}

/**
 * Checks whether the current browser environment satisfies the secure context
 * requirements needed for navigator.mediaDevices.getUserMedia.
 */
export function isSecureCameraContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.isSecureContext) return true;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

/**
 * Cached instance of native BarcodeDetector if supported by the browser.
 */
let nativeDetectorInstance: BarcodeDetectorInstance | null = null;
let nativeDetectorChecked = false;

export function getNativeBarcodeDetector(): BarcodeDetectorInstance | null {
    if (typeof window === 'undefined') return null;
    if (nativeDetectorChecked) return nativeDetectorInstance;

    nativeDetectorChecked = true;
    if ('BarcodeDetector' in window && typeof window.BarcodeDetector === 'function') {
        try {
            nativeDetectorInstance = new window.BarcodeDetector({ formats: ['qr_code'] });
        } catch {
            nativeDetectorInstance = null;
        }
    }
    return nativeDetectorInstance;
}

/**
 * Reset cached detector (useful for unit tests).
 */
export function resetNativeDetectorCache(): void {
    nativeDetectorInstance = null;
    nativeDetectorChecked = false;
}

/**
 * Detects a QR code from a live video element or canvas.
 * Prioritizes the native hardware-accelerated BarcodeDetector API.
 * Falls back to an optimized, downscaled jsQR pass if unsupported.
 */
export async function detectQrFromSource(
    source: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    canvas?: HTMLCanvasElement
): Promise<ParsedReceiptQr | null> {
    // 1. Hardware-accelerated native BarcodeDetector
    const nativeDetector = getNativeBarcodeDetector();
    if (nativeDetector) {
        try {
            const barcodes = await nativeDetector.detect(source);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
                const parsed = parseReceiptQr(barcodes[0].rawValue);
                if (parsed) return parsed;
            }
        } catch {
            // Fall through to jsQR fallback if native detection fails on a frame
        }
    }

    // 2. High-performance jsQR fallback with downscaling
    const width = 'videoWidth' in source ? source.videoWidth : source.width;
    const height = 'videoHeight' in source ? source.videoHeight : source.height;

    if (!width || !height || width <= 0 || height <= 0) return null;

    // Scale down if resolution exceeds 640px to keep jsQR decoding fast (<10ms)
    const MAX_DIM = 640;
    let targetWidth = width;
    let targetHeight = height;

    if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) {
            targetWidth = MAX_DIM;
            targetHeight = Math.round((height * MAX_DIM) / width);
        } else {
            targetHeight = MAX_DIM;
            targetWidth = Math.round((width * MAX_DIM) / height);
        }
    }

    const targetCanvas = canvas || document.createElement('canvas');
    if (targetCanvas.width !== targetWidth) targetCanvas.width = targetWidth;
    if (targetCanvas.height !== targetHeight) targetCanvas.height = targetHeight;

    const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
        return parseReceiptQr(code.data);
    }

    return null;
}
