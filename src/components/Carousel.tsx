function Carousel({
    files, 
    changeImagePath,
    selectedImg,
}:{
    files: string[], 
    changeImagePath: (url:string) => void,
    selectedImg: string
}){
    return (
        <div className="w-full h-full border-std p-3 bg-white">
            <div className="w-full h-full flex overflow-x-scroll space-x-4 perma-scroll">
                {files.map((file, i) => {
                    return (
                        <img src={file} key={i} alt="" 
                        className={`
                            max-h-full 
                            w-auto 
                            cursor-pointer
                            hover:border-std 
                            ${file === selectedImg ? "border-std bg-main-green" : "bg-secondary-green"}`
                        } 
                        onClick={() => changeImagePath(file)}/>
                    )
                })}
            </div>
        </div>
    )
}
export {Carousel}