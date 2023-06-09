// import { useState } from 'react';
import {LoadingBar} from './LoadingBar';
// import Cropper from 'react-easy-crop';
// import {useState, useCallback} from 'react'
// import { Point, Area } from "react-easy-crop/types";
// import { CloseButton } from './CloseButton';
// import { Slider } from './Slider';
// import { getCroppedImg } from '../utils/canvasUtils'
// import { ReactEventHandler } from 'react';
import { ReactElement } from 'react';

function Upload({
    imagePath,
    handleFileUpload,
    text,
    loading,
    children,
    showCropModal,
    cropModal,
    runOCR
}: {
    imagePath: string,
    handleFileUpload: (event: any) => void,
    text: string,
    loading: number,
    children: ReactElement,
    showCropModal: () => void,
    cropModal: boolean,
    runOCR: boolean
}) {
    return (
        <div className="flex flex-col justify-around text-center items-center p-3 
            row-start-2 row-span-full
            border-std bg-white">
            { loading !== 0 && runOCR && LoadingBar(loading) }
            {imagePath && <img src={imagePath} alt="uploadedImage" className="h-4/5 w-auto rounded-md"/>}
            { cropModal && children }
            <div>
                <label htmlFor="uploadFile" className="btn-std mx-3 inline-block bg-main-green text-white"> 
                    Upload file(s)
                </label>
                <input type="file" id="uploadFile" name="uploadFile" onChange={handleFileUpload} 
                    className="hidden" multiple accept="image/png, image/jpeg, image/jpg"
                />
                <button onClick={showCropModal} className="btn-std mx-3 bg-main-green text-white"> Edit</button>
            </div>
        </div>

    )
}
export { Upload }