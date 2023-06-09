function TextArea({
    heading,
    text,
    setText,
    handleTextSave
}: {
    heading: string,
    text: string,
    setText: any,
    handleTextSave: (i: string) => void
}){
    return (
        <div className="h-full w-full flex flex-col justify-between text-center p-3">
            <label htmlFor="current_text" className=""> {heading} </label>
            <textarea name="" id="current_text" value={text} data-testid="textArea"
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
    )
}
export {TextArea}