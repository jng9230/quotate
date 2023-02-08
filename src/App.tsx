
import { useState } from 'react';
// import { arrayBuffer } from 'stream/consumers';
// import * as Tesseract from 'tesseract.js';
import './App.css';
import { Carousel } from './Carousel';
import { Textbox } from './Textbox';
import { Upload } from './Upload';
// const { promisify } = require('util');
// const convert = require('heic-convert');

// const isDevServer = process.env.WEBPACK_SERVE;
// console.log(isDevServer)

function App() {


  return (
    <div className="App">
      <main className="App-main grid grid-cols-2 grid-rows-2">
        <Carousel></Carousel>
        <Textbox></Textbox>
        <Upload></Upload>
        <Textbox></Textbox>
      </main>
    </div>
  );
}

export default App
