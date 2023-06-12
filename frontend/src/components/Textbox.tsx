// import { useState } from 'react';
import { TextArea } from "./TextArea"
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
            border-std bg-white p-3">
            <TextArea heading={"Edit converted text:"} text={text} setText={setText} handleTextSave={handleTextSave}></TextArea>
        </div>
    )
}
export {Textbox}