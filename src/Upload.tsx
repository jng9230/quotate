// import * as Tesseract from 'tesseract.js';
// import { useState } from 'react';
import {LoadingBar} from './LoadingBar';
import Cropper from 'react-easy-crop';
import {useState, useCallback} from 'react'
import { Point, Area } from "react-easy-crop/types";

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
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            console.log(croppedArea, croppedAreaPixels);
        },
        []
    );
    
    const [showCrop, setShowCrop] = useState(false);
    const updateShowCrop = () => {
        setShowCrop(true);
    }
    return (
        <div className="flex flex-col justify-between text-center items-center p-3">
            { loading !== 0 && LoadingBar(loading) }
            <img src={imagePath} alt="" className="h-3/5 w-auto"/>
            {showCrop && 
                <div className="bg-black/[.60] fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full">
                    <div className="rounded-lg w-full h-full max-w-2xl md:h-auto p-4 overflow-hidden m-auto bg-white">
                        <div className="crop_container relative w-full h-96">
                            <Cropper
                                image={imagePath}
                                crop={crop}
                                zoom={zoom}
                                aspect={2/1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <p>penis penis penis</p>
                    </div>
                </div>
            }
            <div>
                <label htmlFor="uploadFile" className="mx-3 inline-block cursor-pointer p-1 rounded-md bg-green-400 text-white"> 
                    Upload file(s)
                </label>
                <input type="file" id="uploadFile" name="uploadFile" onChange={handleFileUpload} 
                    className="hidden" multiple accept="image/png, image/jpeg, image/jpg"
                />
                <button className=" rounded-md bg-purple-500 p-1 text-white" onClick={handleClick}> Convert </button>
                <button className=" rounded-md bg-purple-500 p-1 text-white mx-3" onClick={updateShowCrop}> Edit </button>
            </div>
        </div>

    )
}
export { Upload }