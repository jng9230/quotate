import * as Tesseract from 'tesseract.js';
import './App.css';
import { Carousel } from './components/Carousel';
import { Textbox } from './components/Textbox';
import { Upload } from './components/Upload';
import { StorageBox } from './components/StorageBox';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

        // worker.postMessage(imagePath);
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
    }
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

    return (
        <div className="App">
            <main className="App-main grid grid-cols-2 grid-rows-2 max-h-screen overflow-hidden w-screen h-screen">
                <Carousel files={files} changeImagePath={changeImagePath}></Carousel>
                <Textbox text={text} setText={setText} handleTextSave={handleTextSave}></Textbox>
                <Upload handleFileUpload={handleFileUpload}
                    imagePath={imagePath}
                    text={text}
                    handleClick={handleClick}
                    loading={loading}
                ></Upload>
                <StorageBox storedText={storedText} deleteText={deleteText}></StorageBox>
            </main>
        </div>
    );
}

export default App
