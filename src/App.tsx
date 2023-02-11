import * as Tesseract from 'tesseract.js';
import { useState } from 'react';
import './App.css';
import { Carousel } from './Carousel';
import { Textbox } from './Textbox';
import { Upload } from './Upload';
import { StorageBox } from './StorageBox';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [imagePath, setImagePath] = useState("");
  const handleFileUpload = (event: any) => {
    const image_url = URL.createObjectURL(event.target.files[0])
    setImagePath(image_url);
  }
  
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(0)
  const handleClick = () => {

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

  const [storedText, setStoredText] = useState<{id: string, text: string}[]>(() => {
    const text_get = localStorage.getItem("text");
    if (text_get != null){
      const text_json = JSON.parse(text_get);
      console.log(text_json);
      return text_json
      // setStoredText(text_json);
    }
    return []
  })

  const handleTextSave = (new_text:string) => {
    setStoredText([{id: uuidv4(), text: new_text}, ...storedText]);
  }
  useEffect(() => {
    console.log(storedText);
    const text_json = JSON.stringify(storedText)
    console.log(text_json)
    localStorage.setItem("text", text_json)
  }, [storedText])

  function deleteText(i:string){
    const filted_text = storedText.filter((d) => d.id !== i);
    setStoredText(filted_text);
  }
  
  return (
    <div className="App">
      <main className="App-main grid grid-cols-2 grid-rows-2 max-h-screen overflow-hidden w-screen h-screen">
        <Carousel></Carousel>
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
