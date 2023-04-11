import * as Tesseract from 'tesseract.js';
import './App.css';
import { Carousel } from './components/Carousel';
import { Textbox } from './components/Textbox';
import { Upload } from './components/Upload';
import { StorageBox } from './components/StorageBox';
import { useEffect, useState, useCallback, } from 'react';
import { getCroppedImg } from './utils/canvasUtils';
import { Point, Area } from "react-easy-crop/types";
import Cropper from 'react-easy-crop';
import { Slider } from './components/Slider';
import { preprocessImageFromURL2 } from './utils/preprocess';
import { Modal } from './components/Modal';
import { useParams } from 'react-router-dom';
import { booksReturnType, quote, quotesReturnType, newQuoteReturnType, deleteQuoteReturnType, userReturnType } from "./components/APIReturnTypes"
import { Link } from "react-router-dom"
import { BiArrowBack } from "react-icons/bi"
import {config} from "./config"

const THRESHOLD_MIN = config.preprocess.THRESHOLD_MIN;
const THRESHOLD_MAX = config.preprocess.THRESHOLD_MAX;
function App() {
    //TODO: OAuth
    // const [authed, setAuthed] = useState(false);
    const [user, setUser] = useState<userReturnType>();
    const authed = user !== undefined;
    console.log(user);
    console.log(authed);
    useEffect(() => {
        // console.log("getting auth stuff")
        fetch(API_BASE + "/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
            }
        })
            .then(res => {
                if (res.status === 200) return res.json();
                throw new Error("failed to authenticate user");
            })
            .then(data => {
                console.log(data);
                console.log(data.user.google_name);
                setUser(data.user)
                // setAuthed(true);
            })
            .catch(err => {
                console.error("Failed to authenticate user.", err)
                // setAuthed(false)
            })
    }, [])

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
                const result1 = result as Tesseract.RecognizeResult;
    
                setText(result1.data.text);
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
        const get_quotes = async () => {
            //get quotes
            fetch(API_BASE + `/quote/quote/all_for_book/${bookID}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    const data1 = data as quotesReturnType[];
                    const data2: quote[] = (data1.map(d => {
                        return {
                            text: d.text,
                            id: d._id,
                            book: d.book
                        }
                    }))
                    setStoredText(data2.reverse())
                })
                .catch(err => { console.error("Error: ", err)})
            
            //set book title
            fetch(API_BASE + `/book/book/id/${bookID}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    const data1 = data as booksReturnType;
                    setBookTitle(data1.title)
                })
                .catch(err => { console.error("Error: ", err) })
        }
        if (user){
            get_quotes();
        } 
    }, [user, bookID])

    const handleTextSave = (new_text: string) => {
        if (new_text === "" || user === undefined){return;}
        // setStoredText([{ id: uuidv4(), text: new_text }, ...storedText]);

        fetch(API_BASE + "/quote/quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "text": new_text, "book": bookID, "user_id": user._id})
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

    function deleteText(i: string) {
        fetch(API_BASE + "/quote/quote", {
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
        const val = parseInt(e.target.value) / THRESHOLD_MAX;
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
            const threshold = val !== THRESHOLD_MIN && val !== THRESHOLD_MAX ? val : -1;
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
            const threshold = binThreshold !== THRESHOLD_MIN && binThreshold !== THRESHOLD_MAX ? binThreshold : -1;
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
    }, [imagePath, croppedAreaPixels, rotation, binThreshold])

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
                        <>
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
                                    min={THRESHOLD_MIN}
                                    max={THRESHOLD_MAX}
                                    step={1}
                                    // list={"markers"}
                                >
                                    <div className="flex justify-between absolute -bottom-2 w-4/5 right-0 text-[8px]">
                                        <span>
                                            None
                                        </span>
                                        <span className="mr-3">
                                            {THRESHOLD_MAX / 2}
                                        </span>
                                        <span>
                                            {THRESHOLD_MAX}
                                        </span>
                                    </div>
                                </Slider>
                                <button className="btn-std border-std border-main-green text-main-green" onClick={cropAndConvert}> Confirm</button>
                            </div>
                        </>
                    </Modal>
                </Upload>
                <StorageBox storedText={storedText} deleteText={deleteText}></StorageBox>
            </main>
        </div>
    );
}

export default App
