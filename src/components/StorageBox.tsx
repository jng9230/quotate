// import { TiDeleteOutline } from 'react-icons/ti';
import { CloseButton } from "./CloseButton"

function StorageBox({ 
    storedText, 
    deleteText
}:{ 
    storedText: {id: string, text: string}[], 
    deleteText: (i: string) => void
}){
    return (
        <div className="p-3 row-start-4 row-span-full col-start-2 col-span-full border-std bg-white">
            <div className="overflow-scroll max-h-full space-y-4 pr-5">
                {storedText.map((d, i) => {
                    return(
                        <div key={d.id} className="border-std border-black px-5 flex justify-between items-center">
                            <p className="w-11/12"> {d.text} </p>
                            {/* <TiDeleteOutline onClick={() => deleteText(d.id)} className="cursor-pointer"></TiDeleteOutline> */}
                            <CloseButton onClick={() => deleteText(d.id)}></CloseButton>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export {StorageBox}