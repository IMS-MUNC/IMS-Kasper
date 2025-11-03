// Reusable barcode detection helpers.
// Uses native BarcodeDetector when available, otherwise falls back to @zxing/browser dynamically.

export async function detectFromImageElement(img, formats = ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code']) {
    // img: HTMLImageElement
    if (!img) return null;
    // helper: create a processed image (scaled, contrast-enhanced) to improve decoding
    const createProcessedImage = async (sourceImg, maxWidth = 1200) => {
        const w = sourceImg.naturalWidth || sourceImg.width || 0;
        const h = sourceImg.naturalHeight || sourceImg.height || 0;
        if (!w || !h) return sourceImg;
        const scale = Math.min(1, maxWidth / w) || 1;
        const cw = Math.max(300, Math.round(w * Math.min(1, maxWidth / w)));
        const ch = Math.round((h / w) * cw);
        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        // draw original image scaled up/down
        ctx.drawImage(sourceImg, 0, 0, cw, ch);
        try {
            // simple contrast enhancement: stretch histogram by factor
            const imgData = ctx.getImageData(0, 0, cw, ch);
            const data = imgData.data;
            const contrast = 1.2; // increase contrast slightly
            const intercept = 128 * (1 - contrast);
            for (let i = 0; i < data.length; i += 4) {
                // convert to grayscale-like by boosting luminance then map back
                const r = data[i], g = data[i + 1], b = data[i + 2];
                let lum = 0.299 * r + 0.587 * g + 0.114 * b;
                lum = lum * contrast + intercept;
                const v = Math.max(0, Math.min(255, lum));
                data[i] = data[i + 1] = data[i + 2] = v;
            }
            ctx.putImageData(imgData, 0, 0);
        } catch (err) {
            // ignore processing errors, fallback to drawn image
            console.warn('Image preprocessing failed', err);
        }
        const processedImg = document.createElement('img');
        processedImg.src = canvas.toDataURL();
        await new Promise(r => { processedImg.onload = r; processedImg.onerror = r; });
        return processedImg;
    };
    // Try native BarcodeDetector
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
            let detector;
            try {
                detector = new window.BarcodeDetector({ formats });
            } catch (e) {
                detector = new window.BarcodeDetector();
            }
            const bitmap = await createImageBitmap(img);
            const barcodes = await detector.detect(bitmap);
            bitmap.close();
            if (barcodes && barcodes.length > 0) {
                return barcodes[0].rawValue || barcodes[0].raw_text || barcodes[0].raw || null;
            }
            return null;
        } catch (err) {
            // Fall through to ZXing
            console.warn('native BarcodeDetector failed on image:', err);
        }
    }

    // ZXing/browser fallback
    try {
        const ZX = await import('@zxing/browser');

        // Some ZXing builds/versions expose different reader names — try common ones
        const ReaderConstructors = [
            ZX?.BrowserMultiFormatReader,
            ZX?.BrowserBarcodeReader,
            ZX?.BrowserQRCodeReader,
            ZX?.BrowserMultiFormatReader?.BrowserMultiFormatReader,
        ].filter(Boolean);

        if (ReaderConstructors.length === 0) {
            console.warn('No ZXing reader constructors found in module', ZX);
            return null;
        }

        // Prepare variants: original image and a preprocessed (contrast/scale) image
        let processedImg = null;
        try {
            processedImg = await createProcessedImage(img);
        } catch (err) {
            processedImg = null;
        }

        // If the image is not attached to the DOM some readers may fail — attach it offscreen
        let tempContainer = null;
        let attached = img.isConnected;
        if (!attached) {
            tempContainer = document.createElement('div');
            // put offscreen but rendered so ZXing can read dimensions
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '1px';
            tempContainer.style.height = '1px';
            tempContainer.style.overflow = 'hidden';
            tempContainer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(tempContainer);
            tempContainer.appendChild(img);
            // Give browser a tick to layout
            await new Promise(r => requestAnimationFrame(r));
        }

        // Try each reader with a small timeout wrapper
        let lastError = null;
        for (const Reader of ReaderConstructors) {
            const codeReader = new Reader();
            try {
                // Some decode methods expect the element to be in the DOM. Use decodeFromImageElement if available.
                const decodePromise = (async () => {
                    // Try original image first
                    if (typeof codeReader.decodeFromImageElement === 'function') {
                        try {
                            const result = await codeReader.decodeFromImageElement(img);
                            const t = result?.getText?.() || (result && result.text) || null;
                            if (t) return t;
                        } catch (e) { /* continue */ }
                    }
                    // If we have a processed image, try it next
                    if (processedImg && typeof codeReader.decodeFromImageElement === 'function') {
                        try {
                            const result2 = await codeReader.decodeFromImageElement(processedImg);
                            const t2 = result2?.getText?.() || (result2 && result2.text) || null;
                            if (t2) return t2;
                        } catch (e) { /* continue */ }
                    }
                    // Fallback: some readers provide decodeFromImage which accepts a file/URL
                    if (typeof codeReader.decodeFromImage === 'function') {
                        const result = await codeReader.decodeFromImage(img);
                        return result?.getText?.() || (result && result.text) || null;
                    }
                    // Fallback: some readers provide decodeFromImage which accepts a file/URL
                    // As a last resort try decodeFromCanvas if available
                    if (typeof codeReader.decodeFromCanvas === 'function') {
                        // draw image to a canvas
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const result = await codeReader.decodeFromCanvas(canvas);
                        return result?.getText?.() || (result && result.text) || null;
                    }
                    throw new Error('No suitable decode method on reader');
                })();

                // Timeout wrapper (3s)
                const timed = await Promise.race([
                    decodePromise,
                    new Promise((_, rej) => setTimeout(() => rej(new Error('ZXing decode timeout')), 3000))
                ]);

                if (timed) {
                    // cleanup
                    try { if (codeReader.reset) codeReader.reset(); } catch (e) { }
                    if (tempContainer) { tempContainer.remove(); }
                    return timed;
                }
            } catch (err) {
                lastError = err;
                try { if (codeReader.reset) codeReader.reset(); } catch (e) { }
                // try next reader
            }
        }

        if (tempContainer) tempContainer.remove();
        console.warn('ZXing image decode failed, last error:', lastError);
        return null;
    } catch (err) {
        console.warn('ZXing import or decode failed', err);
        return null;
    }
}

export function startVideoDetector(videoEl, onDetected, options = {}) {
    // options: { formats, intervalMs }
    const formats = options.formats || ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code'];
    const intervalMs = options.intervalMs || 300;
    const autoStopOnDetect = typeof options.autoStopOnDetect === 'boolean' ? options.autoStopOnDetect : true;
    const cooldownMs = typeof options.cooldownMs === 'number' ? options.cooldownMs : 1500; // ignore duplicate callbacks within this window
    let running = true;
    let loopId = null;
    let zxingController = null;
    let fallbackTimer = null;
    let zxingStarted = false;
    let lastDetectedAt = 0;
    let lastDetectedValue = null;

    async function stop() {
        running = false;
        if (loopId) {
            clearTimeout(loopId);
            loopId = null;
        }
        if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
        }
        if (zxingController && zxingController.reset) {
            try { zxingController.reset(); } catch (e) { /* ignore */ }
            zxingController = null;
        }
        // also stop any media tracks attached to the video element
        try {
            if (videoEl && videoEl.srcObject) {
                const stream = videoEl.srcObject;
                if (stream.getTracks) {
                    stream.getTracks().forEach(t => {
                        try { t.stop(); } catch (e) { /* ignore */ }
                    });
                }
                try { videoEl.srcObject = null; } catch (e) { /* ignore */ }
            }
        } catch (e) {
            // ignore
        }
    }

    async function nativeLoop() {
        try {
            let detector;
            try {
                detector = new window.BarcodeDetector({ formats });
            } catch (e) {
                detector = new window.BarcodeDetector();
            }
            // If native detector is available but doesn't find anything within a short time,
            // automatically start the ZXing fallback (some devices expose BarcodeDetector but it fails on video frames).
            fallbackTimer = setTimeout(() => {
                if (running && !zxingStarted) {
                    zxingStarted = true;
                    // start fallback in background
                    fallbackToZxing();
                }
            }, 5000);
            while (running) {
                try {
                    if (!videoEl || videoEl.readyState < 2) {
                        await new Promise(r => setTimeout(r, intervalMs));
                        continue;
                    }
                    const bitmap = await createImageBitmap(videoEl);
                    const barcodes = await detector.detect(bitmap);
                    bitmap.close();
                    if (barcodes && barcodes.length > 0) {
                        // found something — cancel fallback timer
                        if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
                        const code = barcodes[0].rawValue || barcodes[0].raw_text || barcodes[0].raw;
                        const now = Date.now();
                        // dedupe similar detections within cooldown window
                        if (code && (now - lastDetectedAt > cooldownMs || code !== lastDetectedValue)) {
                            lastDetectedAt = now;
                            lastDetectedValue = code;
                            try {
                                onDetected(code);
                            } catch (e) { /* ignore */ }
                            if (autoStopOnDetect) {
                                await stop();
                                return;
                            }
                        }
                    }
                } catch (err) {
                    console.warn('native detect error', err);
                }
                await new Promise(r => setTimeout(r, intervalMs));
            }
        } catch (err) {
            console.warn('nativeLoop error', err);
            // fall back to zxing
            if (!zxingStarted) {
                zxingStarted = true;
                await fallbackToZxing();
            }
        }
    }

    async function fallbackToZxing() {
        try {
            const ZX = await import('@zxing/browser');
            const codeReader = new ZX.BrowserMultiFormatReader();
            zxingController = codeReader;
            zxingStarted = true;
            // decodeFromVideoDevice will call callback when a result is found
            await codeReader.decodeFromVideoDevice(undefined, videoEl, (result, err) => {
                if (result) {
                    const code = result.getText();
                    const now = Date.now();
                    if (code && (now - lastDetectedAt > cooldownMs || code !== lastDetectedValue)) {
                        lastDetectedAt = now;
                        lastDetectedValue = code;
                        try { onDetected(code); } catch (e) { /* ignore */ }
                        if (autoStopOnDetect) {
                            try { codeReader.reset(); } catch (e) { /* ignore */ }
                            running = false;
                        }
                    }
                }
            });
        } catch (err) {
            console.warn('ZXing fallback for video failed', err);
        }
    }

    // Start with native if available
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        nativeLoop();
    } else {
        fallbackToZxing();
    }

    return { stop };
}

export default {
    detectFromImageElement,
    startVideoDetector,
};
