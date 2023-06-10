// import { TiDeleteOutline } from 'react-icons/ti';
import { CloseButton } from "./CloseButton"
import { QuoteBlock } from "./QuoteBlock"
import { quote } from "../utils/APIReturnTypes"
function StorageBox({ 
    storedText, 
    deleteText,
    setQuotes,
    handleTextSave,
    setFocusedQuote,
    editQuoteModal,
    setEditQuoteModal,
    setEditText
}:{ 
    storedText: {id: string, text: string}[], 
    deleteText: (i: string) => void,
    setQuotes: React.Dispatch<React.SetStateAction<quote[]>>,
    handleTextSave: (newText: string) => void,
    setFocusedQuote: React.Dispatch<React.SetStateAction<quote>>,
    editQuoteModal: boolean,
    setEditQuoteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setEditText: React.Dispatch<React.SetStateAction<string>>,
}){
    return (
        <div className="row-start-4 row-span-full col-start-2 col-span-full border-std bg-white">
            <div className="overflow-scroll max-h-full space-y-4 p-3">
                {storedText.map((d, i) => {
                    return(
                        // <div key={d.id} className="border-std border-black flex justify-between items-center">
                        //     <div className="w-11/12 p-3 py-1" data-testid={`storedQuote-${d.id}`}> {d.text} </div>
                        //     <CloseButton styles="mr-2" onClick={() => deleteText(d.id)} testID={`deleteQuote-${d.id}`}></CloseButton>
                        // </div>
                        <QuoteBlock 
                            quote={{text:d.text, id:d.id, book: ""}} 
                            deleteText={deleteText} 
                            setQuotes={setQuotes}
                            handleTextSave={handleTextSave}
                            setFocusedQuote={setFocusedQuote}
                            editQuoteModal={editQuoteModal}
                            setEditQuoteModal={setEditQuoteModal}
                            setEditText={setEditText}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export {StorageBox}