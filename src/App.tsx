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


function App() {
    //web workers
    // const worker: Worker = useMemo(
    //     () => new Worker(new URL("./workers/tesseract.ts", import.meta.url)),
    //     [] 
    // )
    // const [workerMessage, setWorkerMessage] = useState("");
    // useEffect(() => {
    //     console.log("workerMessage variable:")
    //     console.log(workerMessage)
    // }, [workerMessage])
    // useEffect(() => {
    //     if (window.Worker) {
    //         worker.postMessage("fuck you");
    //     }
    // }, [worker]);
    // useEffect(() => {
    //     worker.onmessage = ((e: MessageEvent) => {
    //         console.log("message from worker:");
    //         console.log(e);
    //         setWorkerMessage(e.data);
    //     })
    // }, [worker])
    
    //regular stuff
    const [imagePath, setImagePath] = useState("");
    const [files, setFiles] = useState<string[]>([])
    const handleFileUpload = (event: any) => {
        console.log(event.target.files)
        const files_arr:File[] = Array.from(event.target.files)
        const file_URLs = files_arr.map((file) => {
            // const image_url = URL.createObjectURL(file)
            // setImagePath(image_url);
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
        // worker.postMessage(imagePath);
        // Tesseract.recognize(
        //     imagePath, 'eng',
        //     {
        //         logger: m => {
        //             console.log(m);
        //             setLoading(m.progress)
        //         }
        //     }
        // )
        // .catch(err => {
        //     console.error(err);
        // })
        // .then(result => {
        //     console.log(result);
        //     const thing = result as Tesseract.RecognizeResult;

        //     setText(thing.data.text);
        // })
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

    // useEffect(() => {
    //     worker.onmessage = ((e:MessageEvent) => {
    //         switch(e.data.type){
    //             case "UPDATE":
    //                 setLoading(e.data.data);
    //                 break;
    //             case "RESULT":
    //                 setText(e.data.data);
    //                 break;
    //             default:
    //                 console.log("DEFAULT CASE ON SWITCH")
    //                 console.log(e)
    //         }
    //     })
    // }, [worker])

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
            // setCroppedImage(croppedImage)
            // RUN TESSERACT
            // Tesseract.recognize(
            //     croppedImage, 'eng',
            //     {
            //         logger: m => {
            //             console.log(m);
            //             setLoading(m.progress)
            //         }
            //     }
            // )
            //     .catch(err => {
            //         console.error(err);
            //     })
            //     .then(result => {
            //         console.log(result);
            //         const thing = result as Tesseract.RecognizeResult;

            //         setText(thing.data.text);
            //     })
            
            //close modal; persist crop area and set displayed image to cropped image
            closeCrop();
            setImagePath(croppedImage);
            setRunOCR(true);
            
            //start converting image 
        } catch (e) {
            console.error(e)
        }
    }, [imagePath, croppedAreaPixels, rotation])
    return (
        <div className="App">
            <main className="App-main grid grid-cols-2 grid-rows-2 max-h-screen overflow-hidden w-screen h-screen">
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
                >
                    <div className={modal}>
                        <div className="rounded-lg w-full h-full max-w-2xl md:h-auto p-6 overflow-hidden m-auto bg-white relative">
                            {/* <TiDeleteOutline onClick={closeCrop} className="cursor-pointer absolute right-1 top-1 hover:fill-red-600"></TiDeleteOutline> */}
                            <CloseButton onClick={closeCrop} styles={closeButtonStyles}></CloseButton>
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
                                {/* <Slider label="Height"></Slider> */}
                                <Slider label="Rotation" onChange={updateRotation}></Slider>
                                <button onClick={cropAndConvert}> Confirm</button>
                            </div>
                        </div>
                    </div>
                </Upload>
                <StorageBox storedText={storedText} deleteText={deleteText}></StorageBox>
            </main>
        </div>
    );
}

export default App
