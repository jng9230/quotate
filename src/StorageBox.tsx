import { TiDeleteOutline } from 'react-icons/ti';

function StorageBox({ 
    storedText, 
    deleteText
}:{ 
    storedText: {id: string, text: string}[], 
    deleteText: (i: string) => void
}){
// function StorageBox(){
    // const stored_text = ["penispenispenispenis penispenispenis penis", "asadas asd asd asd sad as ad"]
    return (
        <div className="p-3 bg-purple-500">
            <div className="overflow-scroll max-h-full space-y-4 ">
                {storedText.map((d, i) => {
                    return(
                        <div key={d.id} className="bg-gray-300 rounded-lg px-5 flex justify-between items-center">
                            <p className="w-11/12"> {d.text} </p>
                            <TiDeleteOutline onClick={() => deleteText(d.id)} className="cursor-pointer"></TiDeleteOutline>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export {StorageBox}