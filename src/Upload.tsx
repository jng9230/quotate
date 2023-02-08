import * as Tesseract from 'tesseract.js';
import { useState } from 'react';
import {LoadingBar} from './LoadingBar';

function Upload() {
    const [imagePath, setImagePath] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(0)

    const handleFileUpload = (event: any) => {
        const image_url = URL.createObjectURL(event.target.files[0])
        setImagePath(image_url);

    }

    const handleClick = () => {

        Tesseract.recognize(
            imagePath, 'eng',
            {
                logger: m => {
                    console.log(m);
                    setLoading(m.progress)
                }
            }
        )
            .catch(err => {
                console.error(err);
            })
            .then(result => {
                // Get Confidence score
                // console.log("BING CHILLING BING CHILLING BING CHILLING")
                console.log(result);
                const thing = result as Tesseract.RecognizeResult;
                console.log(thing);
                console.log(thing.data.text);

                // let text = result.text
                setText(thing.data.text);
            })
    }
    return (
        <div>
            <h3>Extracted text</h3>
            <div className="text-box mb-20">
            <p> {text} </p>
            </div>
            <label htmlFor="uploadFile"> Choose image(s) to upload.</label>
            { loading !== 0 && LoadingBar(loading) }
            <img src={imagePath} alt="" className="max-w-xs max-h-96"/>
            <input type="file" name="uploadFile"  onChange={handleFileUpload} />
            <button className="rounded-md bg-purple-500 p-1 text-white" onClick={handleClick}> convert to text</button>
        </div>

    )
}
export { Upload }