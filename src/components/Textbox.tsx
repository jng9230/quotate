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
        <div className="h-full w-full col-start-2 col-span-full row-start-1 row-span-3
            border-std bg-white">
            <div className="h-full w-full flex flex-col justify-between text-center p-3">
                <label htmlFor="current_text" className=""> Edit converted text:</label>
                <textarea name="" id="current_text" value={text} 
                    className="
                        box-border 
                        w-full 
                        h-4/6 
                        bg-transparent 
                        border-std 
                        border-black 
                        px-3 
                        resize-none
                    "
                    onChange={e => setText(e.target.value)}
                >
                </textarea>
                <button 
                    className="btn-std text-white bg-main-green self-center mb-1"
                    onClick={() => handleTextSave(text)}
                > 
                    Save 
                </button>
            </div>
        </div>
    )
}
export {Textbox}