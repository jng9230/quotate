import { CloseButton } from "./CloseButton"
import { BiPencil } from "react-icons/bi"
import { Modal } from "./Modal"
import { useState } from "react"
import { TextArea } from "./TextArea";
import { editQuote } from "../utils/apiCalls";
import { quote } from "../utils/APIReturnTypes";

function QuoteBlock({
    quote,
    deleteText,
    setQuotes,
    handleTextSave,
    setFocusedQuote,
    editQuoteModal,
    setEditQuoteModal,
    setEditText
}: {
    quote: quote,
    deleteText: (id: string) => void,
    setQuotes: React.Dispatch<React.SetStateAction<quote[]>>,
    handleTextSave: (newText:string) => void,
    setFocusedQuote: React.Dispatch<React.SetStateAction<quote>>,
    editQuoteModal: boolean,
    setEditQuoteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setEditText: React.Dispatch<React.SetStateAction<string>>,
}){
    // const [editQuoteModal, setEditQuoteModal] = useState(false);
    const [text, setText] = useState(quote.text);
    const handleEditClick = () => {
        console.log(`setting to ${quote.text}`)
        setFocusedQuote(quote)
        setEditText(quote.text)
        setEditQuoteModal(true)
    }
    return (
        <div key={quote.id} className="border-std border-black flex justify-between items-center mb-2">
            <div className="w-11/12 p-3 py-1" data-testid={`storedQuote-${quote.id}`}> {quote.text} </div>
            <BiPencil onClick={handleEditClick} className="cursor-pointer scale-90"></BiPencil>
            <CloseButton styles="mr-2" onClick={() => deleteText(quote.id)} testID={`deleteQuote-${quote.id}`}></CloseButton>
        </div>
    )
}
export {QuoteBlock}