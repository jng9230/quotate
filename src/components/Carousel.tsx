function Carousel({files, changeImagePath}:{files: string[], changeImagePath: (url:string) => void}){
    return (
        <div className="w-full h-1/2 bg-gray-300 p-3">
            <div className="w-full h-full bg-gray-300 flex overflow-x-scroll space-x-4">
                {files.map((file, i) => {
                    return (
                        <img src={file} key={i} alt="" className="max-h-full w-auto cursor-pointer" onClick={() => changeImagePath(file)}/>
                    )
                })}
            </div>
        </div>
    )
}
export {Carousel}