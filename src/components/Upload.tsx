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
    cropModal
}: {
    imagePath: string,
    handleFileUpload: (event: any) => void,
    text: string,
    loading: number,
    handleClick: () => void,
    children: ReactElement,
    showCropModal: () => void,
    cropModal: boolean
}) {
    // const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    // const [zoom, setZoom] = useState(1);
    // const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    // const onCropComplete = useCallback((croppedArea:Area, croppedAreaPixels:Area) => {
    //     setCroppedAreaPixels(croppedAreaPixels)
    // }, [])
    
    // const [cropModal, setCropModal] = useState(false);
    // const showCropModal = () => {
    //     if (imagePath){
    //         setCropModal(true);
    //     }
    // }
    // const closeCrop = () => {
    //     setCropModal(false);
    // }
    // const modal = "bg-black/[.60] fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full";
    // const closeButtonStyles = "absolute right-1 top-1"
    // const [rotation, setRotation] = useState(0);
    // const updateRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const rotation = parseInt(e.target.value);
    //     setRotation(rotation)
    // }

    // const cropAndConvert = useCallback(async () => {
    //     try {
    //         if (croppedAreaPixels == null){
    //             throw new Error("croppedAreaPixels is undefined");
    //         }

    //         const croppedImage = await getCroppedImg(
    //             imagePath,
    //             croppedAreaPixels,
    //             rotation
    //         )
    //         console.log('donee', { croppedImage })
    //         if (croppedImage == null) {
    //             throw new Error("croppedImage is undefined");
    //         }
    //         // setCroppedImage(croppedImage)
    //         // RUN TESSERACT
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }, [imagePath, croppedAreaPixels, rotation])
    
    return (
        <div className="flex flex-col justify-between text-center items-center p-3">
            { loading !== 0 && LoadingBar(loading) }
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