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
import { useParams, Link } from 'react-router-dom';
import { quote, userReturnType } from "./utils/APIReturnTypes"
import { BiArrowBack } from "react-icons/bi"
import {config} from "./config"
import { addNewQuote, deleteQuote, getAuthedUser, getBookTitle, getQuotesForBook } from './utils/apiCalls';

const THRESHOLD_MIN = config.preprocess.THRESHOLD_MIN;
const THRESHOLD_MAX = config.preprocess.THRESHOLD_MAX;
function App() {
    //TODO: OAuth
    const [user, setUser] = useState<userReturnType>();
    const authed = user !== undefined;
    //auth status changes -> reset user based on auth token
    // const [searchParams, setSearchParams] = useSearchParams();

    // console.log(searchParams.entries());
    // const token = useParams().token;
    // const token = searchParams.get('token');
    useEffect(() => {
        // if (token === undefined || token == null) { console.error("NO TOKEN PROVIDED"); return; }
        getAuthedUser()
            .then(res => {
                setUser(res)
            })
            .catch(err => console.error(err))
    }, [authed])

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

    const bookID = useParams().id;
    const [storedText, setStoredText] = useState<quote[]>([]);
    //get initial quotes for book
    const [bookTitle, setBookTitle] = useState("")
    useEffect(() => {
        if (user === undefined || bookID === undefined){return;}
        getQuotesForBook(bookID)
            .then(data => {
                const data1: quote[] = (data.map(d => {
                    return {
                        text: d.text,
                        id: d._id,
                        book: d.book
                    }
                }))
                setStoredText(data1.reverse())
            })
            .catch(err => { console.error(err)})
        
        getBookTitle(bookID) 
            .then(data => {
                setBookTitle(data.title)
            })
            .catch(err => { console.error(err) })
    }, [user, bookID])

    const handleTextSave = (new_text: string) => {
        if (new_text === "" || user === undefined || bookID === undefined){return;}
        addNewQuote(new_text, bookID, user)
            .then(data => {
                const new_quote = {
                    text: new_text,
                    book: data.book,
                    id: data._id
                }
                setStoredText([new_quote, ...storedText])
            })
            .catch(err => console.error(err))
    }

    function deleteText(id:string) {
        deleteQuote(id)
            .then(data => {
                // console.log(data);
                const filted_text = storedText.filter((d) => d.id !== data.result._id);
                setStoredText(filted_text);
            })
            .catch(err => console.error(err))
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
    let timeout:any;
    // user updates threshold -> hold out until they are certain (500ms)
    const updateBinThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) / THRESHOLD_MAX;
        window.clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("WOOOOOOOOO")
            updateBinThresholdCallback(val);
        }, 500)
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
