// import { useState } from 'react';
import {LoadingBar} from './LoadingBar';
import Cropper from 'react-easy-crop';
import {useState, useCallback} from 'react'
import { Point, Area } from "react-easy-crop/types";
// import { TiDeleteOutline } from 'react-icons/ti';
import { CloseButton } from './CloseButton';
import { Slider } from './Slider';
import { Button } from './Button';

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
            // console.log(croppedArea, croppedAreaPixels);
        },
        []
    );
    
    const [cropModal, setCropModal] = useState(false);
    const showCropModal = () => {
        if (imagePath){
            setCropModal(true);
        }
    }
    const closeCrop = () => {
        setCropModal(false);
    }
    const modal = "bg-black/[.60] fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full";
    const closeButtonStyles = "absolute right-1 top-1"
    const [rotation, setRotation] = useState(0);
    const updateRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rotation = parseInt(e.target.value);
        setRotation(rotation)
    }
    return (
        <div className="flex flex-col justify-between text-center items-center p-3">
            { loading !== 0 && LoadingBar(loading) }
            <img src={imagePath} alt="" className="h-3/5 w-auto"/>
            {cropModal && 
                <div className={modal}>
                    <div className="rounded-lg w-full h-full max-w-2xl md:h-auto p-6 overflow-hidden m-auto bg-white relative">
                        {/* <TiDeleteOutline onClick={closeCrop} className="cursor-pointer absolute right-1 top-1 hover:fill-red-600"></TiDeleteOutline> */}
                        <CloseButton onClick={closeCrop} styles={closeButtonStyles}></CloseButton>
                        <div className="crop_container relative w-full h-96">
                            <Cropper
                                image={imagePath}
                                crop={crop}
                                zoom={zoom}
                                aspect={2/1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                rotation={rotation}
                                onRotationChange={setRotation}
                            />
                        </div>
                        <div id="sliderContainer" className="space-y-4 pt-4">
                            {/* <Slider label="Height"></Slider> */}
                            <Slider label="Rotation" onChange={updateRotation}></Slider>
                        </div>
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
                <Button onClick={handleClick} label="Convert" styles="bg-purple-500 text-white"></Button>
                <Button onClick={showCropModal} label="Edit" styles="bg-purple-500 mx-3 text-white"></Button>
            </div>
        </div>

    )
}
export { Upload }