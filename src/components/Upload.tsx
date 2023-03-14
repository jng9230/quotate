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
    handleClick,
    children,
    showCropModal,
    cropModal,
    runOCR
}: {
    imagePath: string,
    handleFileUpload: (event: any) => void,
    text: string,
    loading: number,
    handleClick: () => void,
    children: ReactElement,
    showCropModal: () => void,
    cropModal: boolean,
    runOCR: boolean
}) {
    return (
        <div className="flex flex-col justify-between text-center items-center p-3">
            { loading !== 0 && runOCR && LoadingBar(loading) }
            <img src={imagePath} alt="" className="h-3/5 w-auto"/>
            { cropModal && children }
            <div>
                <label htmlFor="uploadFile" className="mx-3 inline-block cursor-pointer p-1 rounded-md bg-green-400 text-white"> 
                    Upload file(s)
                </label>
                <input type="file" id="uploadFile" name="uploadFile" onChange={handleFileUpload} 
                    className="hidden" multiple accept="image/png, image/jpeg, image/jpg"
                />
                <button onClick={handleClick} className="btn-std bg-purple-500 text-white"> Convert </button>
                <button onClick={showCropModal} className="btn-std bg-purple-500 mx-3 text-white"> Edit</button>
            </div>
        </div>

    )
}
export { Upload }