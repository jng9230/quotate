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
        <div className="h-full w-full flex flex-col justify-between text-center">
            <label htmlFor="current_text" className=""> {heading} </label>
            <textarea name="" id="current_text" value={text} data-testid="textArea"
                className="
                        box-border 
                        w-full 
                        h-44
                        bg-transparent 
                        border-std 
                        border-black 
                        px-3 
                        resize-none
                        mb-2
                    "
                onChange={e => setText(e.target.value)}
            >
            </textarea>
            <button
                className="btn-std border-main-green text-main-green border-std self-center mb-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleTextSave(text)}
                disabled={text === "" ? true : false}
            >
                Save
            </button>
        </div>
    )
}
export {TextArea}