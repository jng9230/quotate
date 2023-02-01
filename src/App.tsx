
import { useState } from 'react';
import * as Tesseract from 'tesseract.js';
import './App.css';


type tesseractResult = {
  data: Object,
  jobId: string
}

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");

  const handleChange = (event:any) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }

  const handleClick = () => {

    Tesseract.recognize(
      imagePath, 'eng',
      {
        logger: m => console.log(m)
      }
    )
      .catch(err => {
        console.error(err);
      })
      .then(result => {
        // Get Confidence score
        // console.log("BING CHILLING BING CHILLING BING CHILLING")
        console.log(result);
        const thing = result as Tesseract.RecognizeResult;
        // let confidence = thing.confidence
        console.log(thing);
        console.log(thing.data.text);

        // let text = result.text
        // setText(text);

      })
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual imagePath uploaded</h3>
        <img
          src={imagePath} className="App-image" alt="logo" />

        <h3>Extracted text</h3>
        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}> convert to text</button>
      </main>
    </div>
  );
}

export default App
