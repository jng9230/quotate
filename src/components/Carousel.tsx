function Carousel({files, changeImagePath}:{files: string[], changeImagePath: (url:string) => void}){
    return (
        <div className="w-full h-full border-std p-3 bg-white">
            <div className="w-full h-full flex overflow-x-scroll space-x-4">
                {files.map((file, i) => {
                    return (
                        <img src={file} key={i} alt="" 
                        className="max-h-full w-auto cursor-pointer
                            hover:border-std" 
                        onClick={() => changeImagePath(file)}/>
                    )
                })}
            </div>
        </div>
    )
}
export {Carousel}