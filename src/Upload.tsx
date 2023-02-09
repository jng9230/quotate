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
        <div className="flex flex-col justify-between text-center items-center p-3">
            {/* <h3>Extracted text</h3> */}
            <div className="text-box max-h-8 overflow-hidden">
                <p> {text} </p>
            </div>
            {/* <label htmlFor="uploadFile"> Choose image(s) to upload.</label> */}
            { loading !== 0 && LoadingBar(loading) }
            <img src={imagePath} alt="" className="h-3/5 w-auto"/>
            <div>
                <label htmlFor="uploadFile" className="mx-3 inline-block cursor-pointer p-1 rounded-md bg-green-400 text-white"> 
                    Upload file(s)
                </label>
                <input type="file" id="uploadFile" name="uploadFile"  onChange={handleFileUpload} className="hidden"/>
                <button className=" rounded-md bg-purple-500 p-1 text-white" onClick={handleClick}> Convert </button>
            </div>
        </div>

    )
}
export { Upload }