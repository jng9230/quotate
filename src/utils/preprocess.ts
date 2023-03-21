import { createImage } from "./canvasUtils";

//https://github.com/processing/p5.js/blob/main/src/image/filters.js
export function preprocessImage(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (ctx == null){console.error("Null context"); return}
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    grayscaleFilter(image.data)
    // thresholdFilter(image.data, 0.35);
    // blurARGB(image.data, canvas, 0.5);
    // dilate(image.data, canvas);
    return image;
}

export function preprocessImage2(canvas: HTMLCanvasElement, thresh: number) {
    const ctx = canvas.getContext('2d');
    if (ctx == null) { console.error("Null context"); return }
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    grayscaleFilter(image.data)
    thresholdFilter(image.data, thresh/10);
    // blurARGB(image.data, canvas, 0.5);
    // dilate(image.data, canvas);
    return image;
}


export async function preprocessImageFromURL(url:string){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx == null){
        console.error("Null canvas")
        return
    }
    const img = await createImage(url)
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0)

    const processed_img = preprocessImage(canvas)
    
    // var canvas = document.createElement('canvas');
    // var ctx = canvas.getContext('2d');
    if (processed_img === undefined){
        return
    }

    ctx.putImageData(processed_img, 0, 0);

    const img2 = new Image();
    img2.src = canvas.toDataURL();
    return img2.src;
}

export async function preprocessImageFromURL2(url: string, thresh: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
        console.error("Null canvas")
        return
    }
    const img = await createImage(url)
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0)

    const processed_img = preprocessImage2(canvas, thresh)

    // var canvas = document.createElement('canvas');
    // var ctx = canvas.getContext('2d');
    if (processed_img === undefined) {
        return
    }

    ctx.putImageData(processed_img, 0, 0);

    const img2 = new Image();
    img2.src = canvas.toDataURL();
    return img2.src;
}

/**
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 */
const thresholdFilter = (pixels: Uint8ClampedArray, level: number) => {
    if (level === undefined) {
        level = 0.5;
    }
    const thresh = Math.floor(level * 255);

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        let val;
        if (gray >= thresh) { //pass threshold -> white
            val = 255;
        } else {
            val = 0;
        }
        pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
    }
};


const grayscaleFilter = (pixels: Uint8ClampedArray) => {
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const val = 0.3 * r + 0.59 * g + 0.11 * b
        pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
    }
};

/**
 * Returns a 32 bit number containing ARGB data at ith pixel in the
 * 1D array containing pixels data.
 * @param  {Uint8ClampedArray} data array returned by _toPixels()
 * @param  {Integer}           i    index of a 1D Image Array
 * @return {Integer}                32 bit integer value representing
 *                                  ARGB value.
 */
function getARGB(data:Uint8ClampedArray, i: number) {
    const offset = i * 4;
    return (
        ((data[offset + 3] << 24) & 0xff000000) |
        ((data[offset] << 16) & 0x00ff0000) |
        ((data[offset + 1] << 8) & 0x0000ff00) |
        (data[offset + 2] & 0x000000ff)
    );
};

/**
 * Modifies pixels RGBA values to values contained in the data object.
 *
 * @param {Uint8ClampedArray} pixels array returned by _toPixels()
 * @param {Int32Array}        data   source 1D array where each value
 *                                   represents ARGB values
 */
function setPixels(pixels: Uint8ClampedArray, data: Int32Array) {
    let offset = 0;
    for (let i = 0, al = pixels.length; i < al; i++) {
        offset = i * 4;
        pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
        pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
        pixels[offset + 2] = data[i] & 0x000000ff;
        pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
    }
};

let blurRadius: number;
let blurKernelSize: number;
let blurKernel: Int32Array;
let blurMult: Int32Array[];

function buildBlurKernel(r: number) {
    let radius = (r * 3.5) | 0;
    radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

    if (blurRadius !== radius) {
        blurRadius = radius;
        blurKernelSize = (1 + blurRadius) << 1;
        blurKernel = new Int32Array(blurKernelSize);
        blurMult = new Array(blurKernelSize);
        for (let l = 0; l < blurKernelSize; l++) {
            blurMult[l] = new Int32Array(256);
        }

        let bk, bki;
        let bm, bmi;

        for (let i = 1, radiusi = radius - 1; i < radius; i++) {
            blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
            bm = blurMult[radius + i];
            bmi = blurMult[radiusi--];
            for (let j = 0; j < 256; j++) {
                bm[j] = bmi[j] = bki * j;
            }
        }
        bk = blurKernel[radius] = radius * radius;
        bm = blurMult[radius];

        for (let k = 0; k < 256; k++) {
            bm[k] = bk * k;
        }
    }
}

function blurARGB(pixels: Uint8ClampedArray, canvas: HTMLCanvasElement, radius: number) {
    const width = canvas.width;
    const height = canvas.height;
    const numPackedPixels = width * height;
    const argb = new Int32Array(numPackedPixels);
    for (let j = 0; j < numPackedPixels; j++) {
        argb[j] = getARGB(pixels, j);
    }
    let sum, cr, cg, cb, ca;
    let read, ri, ym, ymi, bk0;
    const a2 = new Int32Array(numPackedPixels);
    const r2 = new Int32Array(numPackedPixels);
    const g2 = new Int32Array(numPackedPixels);
    const b2 = new Int32Array(numPackedPixels);
    let yi = 0;
    buildBlurKernel(radius);
    let x, y, i;
    let bm;
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            cb = cg = cr = ca = sum = 0;
            read = x - blurRadius;
            if (read < 0) {
                bk0 = -read;
                read = 0;
            } else {
                if (read >= width) {
                    break;
                }
                bk0 = 0;
            }
            for (i = bk0; i < blurKernelSize; i++) {
                if (read >= width) {
                    break;
                }
                const c = argb[read + yi];
                bm = blurMult[i];
                ca += bm[(c & -16777216) >>> 24];
                cr += bm[(c & 16711680) >> 16];
                cg += bm[(c & 65280) >> 8];
                cb += bm[c & 255];
                sum += blurKernel[i];
                read++;
            }
            ri = yi + x;
            a2[ri] = ca / sum;
            r2[ri] = cr / sum;
            g2[ri] = cg / sum;
            b2[ri] = cb / sum;
        }
        yi += width;
    }
    yi = 0;
    ym = -blurRadius;
    ymi = ym * width;
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            cb = cg = cr = ca = sum = 0;
            if (ym < 0) {
                bk0 = ri = -ym;
                read = x;
            } else {
                if (ym >= height) {
                    break;
                }
                bk0 = 0;
                ri = ym;
                read = x + ymi;
            }
            for (i = bk0; i < blurKernelSize; i++) {
                if (ri >= height) {
                    break;
                }
                bm = blurMult[i];
                ca += bm[a2[read]];
                cr += bm[r2[read]];
                cg += bm[g2[read]];
                cb += bm[b2[read]];
                sum += blurKernel[i];
                ri++;
                read += width;
            }
            argb[x + yi] =
                ((ca / sum) << 24) |
                ((cr / sum) << 16) |
                ((cg / sum) << 8) |
                (cb / sum);
        }
        yi += width;
        ymi += width;
        ym++;
    }
    setPixels(pixels, argb);
}

function dilate(pixels: Uint8ClampedArray, canvas: HTMLCanvasElement) {
    let currIdx = 0;
    const maxIdx = pixels.length ? pixels.length / 4 : 0;
    const out = new Int32Array(maxIdx);
    let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

    let idxRight, idxLeft, idxUp, idxDown;
    let colRight, colLeft, colUp, colDown;
    let lumRight, lumLeft, lumUp, lumDown;

    while (currIdx < maxIdx) {
        currRowIdx = currIdx;
        maxRowIdx = currIdx + canvas.width;
        while (currIdx < maxRowIdx) {
            colOrig = colOut = getARGB(pixels, currIdx);
            idxLeft = currIdx - 1;
            idxRight = currIdx + 1;
            idxUp = currIdx - canvas.width;
            idxDown = currIdx + canvas.width;

            if (idxLeft < currRowIdx) {
                idxLeft = currIdx;
            }
            if (idxRight >= maxRowIdx) {
                idxRight = currIdx;
            }
            if (idxUp < 0) {
                idxUp = 0;
            }
            if (idxDown >= maxIdx) {
                idxDown = currIdx;
            }
            colUp = getARGB(pixels, idxUp);
            colLeft = getARGB(pixels, idxLeft);
            colDown = getARGB(pixels, idxDown);
            colRight = getARGB(pixels, idxRight);

            //compute luminance
            currLum =
                77 * ((colOrig >> 16) & 0xff) +
                151 * ((colOrig >> 8) & 0xff) +
                28 * (colOrig & 0xff);
            lumLeft =
                77 * ((colLeft >> 16) & 0xff) +
                151 * ((colLeft >> 8) & 0xff) +
                28 * (colLeft & 0xff);
            lumRight =
                77 * ((colRight >> 16) & 0xff) +
                151 * ((colRight >> 8) & 0xff) +
                28 * (colRight & 0xff);
            lumUp =
                77 * ((colUp >> 16) & 0xff) +
                151 * ((colUp >> 8) & 0xff) +
                28 * (colUp & 0xff);
            lumDown =
                77 * ((colDown >> 16) & 0xff) +
                151 * ((colDown >> 8) & 0xff) +
                28 * (colDown & 0xff);

            if (lumLeft > currLum) {
                colOut = colLeft;
                currLum = lumLeft;
            }
            if (lumRight > currLum) {
                colOut = colRight;
                currLum = lumRight;
            }
            if (lumUp > currLum) {
                colOut = colUp;
                currLum = lumUp;
            }
            if (lumDown > currLum) {
                colOut = colDown;
                currLum = lumDown;
            }
            out[currIdx++] = colOut;
        }
    }
    setPixels(pixels, out);
};