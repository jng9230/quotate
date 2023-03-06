// import { useState } from 'react';

function Textbox({ 
    text, 
    setText, 
    handleTextSave
}: {
    text: string, 
    setText: any, 
    handleTextSave: (i:string) => void
}){
    // const [text, setText] = useState(converted_text);    

    return (
        <div className="h-full w-full p-4">
            <div className="h-full w-full bg-green-400 flex flex-col justify-between text-center">
                <label htmlFor="current_text"> Edit converted text:</label>
                <textarea name="" id="current_text" value={text} 
                    className="box-border w-full h-4/6 bg-transparent"
                    onChange={e => setText(e.target.value)}
                >
                </textarea>
                <button 
                    className="btn-std text-white bg-purple-500 self-center mb-1"
                    onClick={() => handleTextSave(text)}
                > 
                    Save 
                </button>
            </div>
        </div>
    )
}
export {Textbox}