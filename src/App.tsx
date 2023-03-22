import * as Tesseract from 'tesseract.js';
import './App.css';
import { Carousel } from './components/Carousel';
import { Textbox } from './components/Textbox';
import { Upload } from './components/Upload';
import { StorageBox } from './components/StorageBox';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCroppedImg } from './utils/canvasUtils';
import { Point, Area } from "react-easy-crop/types";
import { CloseButton } from './components/CloseButton';
import Cropper from 'react-easy-crop';
import { Slider } from './components/Slider';
import { preprocessImageFromURL, preprocessImageFromURL2 } from './utils/preprocess';
import { Modal } from './components/Modal';
import { useParams } from 'react-router-dom';
import { book, booksReturnType, quote, quotesReturnType, newQuoteReturnType, deleteQuoteReturnType } from "./components/APIReturnTypes"
import { Link } from "react-router-dom"
import { BiArrowBack } from "react-icons/bi"

function App() {
    //regular stuff
    const [imagePath, setImagePath] = useState("");
    const [processedImagePath, setProcessedImagePath] = useState<string>();
    const [selectedImg, setSelectedImg] = useState("");
    const [files, setFiles] = useState<string[]>([])
    const handleFileUpload = (event: any) => {
        console.log(event.target.files)
        const files_arr:File[] = Array.from(event.target.files)
        const file_URLs = files_arr.map((file) => {
            return URL.createObjectURL(file)
        }); 
        setFiles([...file_URLs, ...files]);
        setImagePath(file_URLs[0]);
        setSelectedImg(file_URLs[0]);
        setProcessedImagePath(undefined);
    }
    function changeImagePath(url:string){
        setImagePath(url);
        setSelectedImg(url);
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
            })
            .then(result => {
                console.log(result);
                const thing = result as Tesseract.RecognizeResult;
    
                setText(thing.data.text);
            })
            .finally(() => {setRunOCR(false)});
        }
        },
        [imagePath, runOCR]
    )

    const API_BASE = "http://localhost:5000";
    const bookID = useParams().id;
    // const [storedText, setStoredText] = useState<{id: string, text: string}[]>(() => {
    const [storedText, setStoredText] = useState<quote[]>(() => {
        // const text_get = localStorage.getItem("text");
        // if (text_get != null) {
        //     const text_json = JSON.parse(text_get);
        //     return text_json
        // }
        // return []
        // console.log(`GETTING QUOTES FOR ${bookID}`)
        return []
    })
    //get initial quotes for book
    const [bookTitle, setBookTitle] = useState("")
    useEffect(() => {
        const thing = async () => {
            //get quotes
            fetch(API_BASE + `/quote/id/${bookID}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    const data1 = data as quotesReturnType[];
                    const thing1: quote[] = (data1.map(d => {
                        return {
                            text: d.text,
                            id: d._id,
                            book: d.book
                        }
                    }))
                    setStoredText(thing1.reverse())
                })
                .catch(err => { console.error("Error: ", err)})
            
            //set book title
            fetch(API_BASE + `/book/id/${bookID}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    const data1 = data as booksReturnType;
                    setBookTitle(data1.title)
                })
                .catch(err => { console.error("Error: ", err) })
        }
        thing();
    }, [])

    const handleTextSave = (new_text: string) => {
        if (new_text === ""){return;}
        // setStoredText([{ id: uuidv4(), text: new_text }, ...storedText]);

        fetch(API_BASE + "/quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "text": new_text, "book": bookID})
            //TODO: handle bookID undefined case
        })
            .then(res => res.json())
            .then(data => {
                let data1 = data as newQuoteReturnType;
                console.log(data1);
                const new_quote: quote = {
                    text: new_text,
                    book: data1.book,
                    id: data1._id
                } 
                setStoredText([new_quote, ...storedText])
            })
            .catch(err => console.error("Error :", err))

    }
    // useEffect(() => {
    //     const text_json = JSON.stringify(storedText)
    //     localStorage.setItem("text", text_json)
    // }, [storedText])

    function deleteText(i: string) {
        fetch(API_BASE + "/quote", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"id": i})
        })
            .then(res => res.json())
            .then(data => {
                let data1 = data as deleteQuoteReturnType;
                console.log(data1);
                const filted_text = storedText.filter((d) => d.id !== i);
                setStoredText(filted_text);
            })
            .catch(err => console.error("Error: ", err))
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
        setProcessedImagePath(undefined);
        if (imagePath) {
            setCropModal(true);
        }
    }
    const closeCrop = () => {
        setCropModal(false);
    }
    // const modal = "bg-black/[.60] fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full";
    // const closeButtonStyles = "absolute right-1 top-1"
    const [rotation, setRotation] = useState(0);
    const updateRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rotation = parseInt(e.target.value);
        setRotation(rotation)
    }

    const [binThreshold, setBinThreshold] = useState(0);
    // const [newBinVal, setBinVal] = useState(binThreshold);
    let timeout:any;
    const updateBinThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) / 20;
        // if (val != binThreshold){
        window.clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("WOOOOOOOOO")
            updateBinThresholdCallback(val);
        }, 500)
        // }
    }
    
    const updateBinThresholdCallback = (val:number) => {
        // console.log(val);
        // console.log(binThreshold);
        // if (val == binThreshold){
        setBinThreshold(val);
        updateCropper(val)
        // }
    }

    const updateCropper = async (val: number) => {
        try {
            if (croppedAreaPixels == null) {
                throw new Error("croppedAreaPixels is undefined");
            }

            const croppedImage = await getCroppedImg(
                imagePath,
                undefined,
                rotation
            )
            console.log('donee', { croppedImage })
            if (croppedImage == null) {
                throw new Error("croppedImage is undefined");
            }

            //close modal; persist crop area and set displayed image to cropped image
            // const processed_img = await preprocessImageFromURL(croppedImage)
            const threshold = val != 0 && val != 20 ? val : -1;
            const processed_img = await preprocessImageFromURL2(croppedImage, threshold)
            if (processed_img === undefined) {
                console.error("Undefined processed image.")
                return
            }
            // setImagePath(processed_img);
            setProcessedImagePath(processed_img);
        } catch {

        }
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
            setProcessedImagePath(undefined);
            closeCrop();
            const threshold = binThreshold != 0 && binThreshold != 20 ? binThreshold : -1;
            const processed_img = await preprocessImageFromURL2(croppedImage, threshold)
            if (processed_img === undefined){
                console.error("Undefined processed image.")
                return
            }
            setImagePath(processed_img);
            setRunOCR(true);
        } catch (e) {
            console.error(e)
        }
    }, [imagePath, croppedAreaPixels, rotation])

    //BACKEND CALLS
    // const bookID = useParams().id;
    //TODO: undefined -> set to some default folder

    const [optionsThreshold, setOptionsThreshold] = useState<number>()
    const updateBinThresholdOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value);
        setOptionsThreshold(val);
        if (val ===  -1){
            updateCropper(val)
        } else {
            updateCropper(val/20)
        }
    }
    // const allOptions = () => {
    // }
    let thing: any[] = []
    thing.push(<option value={-1} key={-1}> {"None"} </option>)
    for (let i = 1; i <= 20; i++){
        thing.push(<option value={i} key={i}> {i} </option>)
    }
    const [size, setSize] = useState(0)
    return (
        <div className="App w-screen h-screen flex flex-col bg-off-white">
            <header className="grid grid-cols-3 p-3">
                <div className="col-start-1">
                    <Link to="/">
                        <button className="btn-std 
                            border-main-green 
                            border-std 
                            bg-white
                            text-main-green
                            flex
                            items-center
                        ">
                            <BiArrowBack className="mr-2"></BiArrowBack>
                            Back
                        </button>
                    </Link>
                </div>
                <div className="col-start-2 self-center col-span-full">
                    <h1 className="text-ellipsis overflow-hidden whitespace-nowrap"> {bookTitle} </h1>
                </div>
            </header>
            <main className="App-main grid 
                grid-cols-2
                sm:grid-cols-3 
                grid-rows-6 
                gap-3
                p-3 pt-0
                overflow-hidden 
                w-full 
                h-full
                ">
                <Carousel files={files} selectedImg={selectedImg} changeImagePath={changeImagePath}></Carousel>
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
                                    image={processedImagePath !== "" && processedImagePath !== undefined ? processedImagePath : imagePath}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={2 / 1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    rotation={rotation}
                                    onRotationChange={setRotation}
                                    // restrictPosition={false}
                                />
                            </div>
                            <div id="optionsContainer" className="space-y-4 pt-4">
                                <Slider label="Rotation" onChange={updateRotation}></Slider>
                                <Slider 
                                    label="B/W Threshold" 
                                    onChange={updateBinThreshold}
                                    min={0}
                                    max={20}
                                    step={1}
                                    // list={"markers"}
                                >
                                    <div className="flex justify-between absolute -bottom-2 w-4/5 right-0 text-[8px]">
                                        <span>
                                            None
                                        </span>
                                        <span className="mr-3">
                                            10
                                        </span>
                                        <span>
                                            20
                                        </span>
                                    </div>
                                </Slider>
                                {/* <input type="range" min="0" max="100" step="25" list="steplist" className="slider"/>
                                    <datalist id="steplist">
                                        <option value={0}>0</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>75</option>
                                        <option>100</option>
                                    </datalist> */}
                                <button className="btn-std border-std border-main-green text-main-green" onClick={cropAndConvert}> Confirm</button>
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
