import Tesseract from "tesseract.js"
// import { useEffect, useState, useCallback, } from 'react';
/**
 * Calls tesseract on the given image path
 * @param imagePath 
 * @returns string of recognized text
 */
export const OCR = (imagePath: string, logSomething: React.Dispatch<React.SetStateAction<number>>) => {
    return new Promise<string>((resolve, reject) => {
        Tesseract.recognize(imagePath, "eng", {
            logger: m => {
                logSomething(m.progress)
            }
        })
            .then(res => {
                const res1 = res as Tesseract.RecognizeResult;
                resolve(res1.data.text)
            })
            .catch(e => reject(e))
    })
}