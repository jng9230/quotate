import Tesseract from "tesseract.js"
/**
 * Calls tesseract on the given image path
 * @param imagePath 
 * @returns string of recognized text
 */
export const OCR = (imagePath: string) => {
    return new Promise<string>((resolve, reject) => {
        Tesseract.recognize(imagePath, "eng", {
        })
            .then(res => {
                const res1 = res as Tesseract.RecognizeResult;
                resolve(res1.data.text)
            })
            .catch(e => reject(e))
    })
}