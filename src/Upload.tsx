// import * as Tesseract from 'tesseract.js';
// import { useState } from 'react';
import {LoadingBar} from './LoadingBar';

function Upload({
    imagePath,
    handleFileUpload,
    text,
    loading,
    handleClick
}: {
    imagePath: string,
    handleFileUpload: (event: any) => void,
    text: string,
    loading: number,
    handleClick: () => void
}) {
    return (
        <div className="flex flex-col justify-between text-center items-center p-3">
            {/* <div className="text-box max-h-8 overflow-hidden">
                <p> {text} </p>
            </div> */}
            {/* <label htmlFor="uploadFile"> Choose image(s) to upload.</label> */}
            { loading !== 0 && LoadingBar(loading) }
            <img src={imagePath} alt="" className="h-3/5 w-auto"/>
            <div>
                <label htmlFor="uploadFile" className="mx-3 inline-block cursor-pointer p-1 rounded-md bg-green-400 text-white"> 
                    Upload file(s)
                </label>
                <input type="file" id="uploadFile" name="uploadFile" onChange={handleFileUpload} 
                    className="hidden" multiple accept="image/png, image/jpeg, image/jpg"
                />
                <button className=" rounded-md bg-purple-500 p-1 text-white" onClick={handleClick}> Convert </button>
            </div>
        </div>

    )
}
export { Upload }