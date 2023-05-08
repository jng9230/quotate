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
        <div className="row-start-4 row-span-full col-start-2 col-span-full border-std bg-white">
            <div className="overflow-scroll max-h-full space-y-4 p-3">
                {storedText.map((d, i) => {
                    return(
                        <div key={d.id} className="border-std border-black flex justify-between items-center">
                            <div className="w-11/12 p-3 py-1" data-testid={`storedQuote-${d.id}`}> {d.text} </div>
                            {/* <TiDeleteOutline onClick={() => deleteText(d.id)} className="cursor-pointer"></TiDeleteOutline> */}
                            <CloseButton styles="mr-2" onClick={() => deleteText(d.id)} testID={`deleteQuote-${d.id}`}></CloseButton>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export {StorageBox}