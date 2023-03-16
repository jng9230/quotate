import * as Tesseract from 'tesseract.js';
import './App.css';
import { Carousel } from './components/Carousel';
import { Textbox } from './components/Textbox';
import { Upload } from './components/Upload';
import { StorageBox } from './components/StorageBox';
import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCroppedImg } from './utils/canvasUtils';
import { Point, Area } from "react-easy-crop/types";
import { CloseButton } from './components/CloseButton';
import Cropper from 'react-easy-crop';
import { Slider } from './components/Slider';
import { preprocessImageFromURL } from './utils/preprocess';
import { Modal } from './components/Modal';

function App() {
    //regular stuff
    const [imagePath, setImagePath] = useState("");
    const [files, setFiles] = useState<string[]>([])
    const handleFileUpload = (event: any) => {
        console.log(event.target.files)
        const files_arr:File[] = Array.from(event.target.files)
        const file_URLs = files_arr.map((file) => {
            return URL.createObjectURL(file)
        }); 
        setFiles([...file_URLs, ...files]);
        setImagePath(file_URLs[0]);
    }
    function changeImagePath(url:string){
        setImagePath(url);
    }

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(0)
    const handleClick = () => {
        if (imagePath === ""){
            console.log("NO IMAGE")
            return; //TODO: set button to inactive instead
        }

        setRunOCR(true);
    }

    const [runOCR, setRunOCR] = useState(false)
    useEffect(() => {
        if (runOCR && imagePath){
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
                setRunOCR(false);
            })
            .then(result => {
                console.log(result);
                const thing = result as Tesseract.RecognizeResult;
    
                setText(thing.data.text);
                setRunOCR(false);
            })
        }
        },
        [imagePath, runOCR]
    )

    const [storedText, setStoredText] = useState<{id: string, text: string}[]>(() => {
        const text_get = localStorage.getItem("text");
        if (text_get != null) {
            const text_json = JSON.parse(text_get);
            return text_json
        }
        return []
    })

    const handleTextSave = (new_text: string) => {
        if (new_text === ""){return;}
        setStoredText([{ id: uuidv4(), text: new_text }, ...storedText]);
    }
    useEffect(() => {
        const text_json = JSON.stringify(storedText)
        localStorage.setItem("text", text_json)
    }, [storedText])

    function deleteText(i: string) {
        const filted_text = storedText.filter((d) => d.id !== i);
        setStoredText(filted_text);
    }


    //CROPPING/ROTATION MODAL
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const [cropModal, setCropModal] = useState(false);
    const showCropModal = () => {
        if (imagePath) {
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

    const cropAndConvert = useCallback(async () => {
        try {
            if (croppedAreaPixels == null) {
                throw new Error("croppedAreaPixels is undefined");
            }

            const croppedImage = await getCroppedImg(
                imagePath,
                croppedAreaPixels,
                rotation
            )
            console.log('donee', { croppedImage })
            if (croppedImage == null) {
                throw new Error("croppedImage is undefined");
            }

            //close modal; persist crop area and set displayed image to cropped image
            closeCrop();
            const processed_img = await preprocessImageFromURL(croppedImage)
            if (processed_img === undefined){
                console.error("the fuck")
                return
            }
            setImagePath(processed_img);
            setRunOCR(true);
        } catch (e) {
            console.error(e)
        }
    }, [imagePath, croppedAreaPixels, rotation])
    return (
        <div className="App">
            <main className="App-main grid grid-cols-3 grid-rows-6 gap-5
                p-3 bg-off-white
                max-h-screen overflow-hidden w-screen h-screen">
                <Carousel files={files} changeImagePath={changeImagePath}></Carousel>
                <Textbox text={text} setText={setText} handleTextSave={handleTextSave}></Textbox>
                <Upload 
                    handleFileUpload={handleFileUpload}
                    imagePath={imagePath}
                    text={text}
                    handleClick={handleClick}
                    loading={loading}
                    showCropModal={showCropModal}
                    cropModal={cropModal}
                    runOCR={runOCR}
                >
                    <Modal onClick={closeCrop}>
                        <div>
                            <div className="crop_container relative w-full h-96">
                                <Cropper
                                    image={imagePath}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={2 / 1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    rotation={rotation}
                                    onRotationChange={setRotation}
                                />
                            </div>
                            <div id="sliderContainer" className="space-y-4 pt-4">
                                <Slider label="Rotation" onChange={updateRotation}></Slider>
                                <button onClick={cropAndConvert}> Confirm</button>
                            </div>
                        </div>
                    </Modal>
                </Upload>
                <StorageBox storedText={storedText} deleteText={deleteText}></StorageBox>
            </main>
        </div>
    );
}

export default App
