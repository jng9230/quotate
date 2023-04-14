/* eslint-disable no-restricted-globals */
import * as Tesseract from 'tesseract.js';

self.onmessage = (e: MessageEvent) => {
    // self.postMessage("wooooooo")
    const imagePath = e.data;
    console.log(imagePath)
    Tesseract.recognize(
        imagePath, 'eng',
        {
            logger: m => {
                console.log(m);
                // setLoading(m.progress)
                self.postMessage({
                    type: "UPDATE",
                    data: m.progress
                })
            }
        }
    )
        .catch(err => {
            console.error(err);
        })
        .then(result => {
            console.log(result);
            const thing = result as Tesseract.RecognizeResult;
            self.postMessage({
                type: "RESULT", 
                data: thing.data.text
            })
            // setText(thing.data.text);
        })
};

export {};