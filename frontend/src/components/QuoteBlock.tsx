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
    setEditQuoteModal
}: {
    quote: quote,
    deleteText: (id: string) => void,
    setQuotes: React.Dispatch<React.SetStateAction<quote[]>>,
    handleTextSave: (newText:string) => void,
    setFocusedQuote: React.Dispatch<React.SetStateAction<quote>>,
    editQuoteModal: boolean,
    setEditQuoteModal: React.Dispatch<React.SetStateAction<boolean>>,
}){
    // const [editQuoteModal, setEditQuoteModal] = useState(false);
    const [text, setText] = useState(quote.text);
    const handleEditClick = () => {
        setFocusedQuote(quote)
        setEditQuoteModal(true)
    }
    return (
        <>
            <div key={quote.id} className="border-std border-black flex justify-between items-center">
                <div className="w-11/12 p-3 py-1" data-testid={`storedQuote-${quote.id}`}> {quote.text} </div>
                <BiPencil onClick={handleEditClick}></BiPencil>
                <CloseButton styles="mr-2" onClick={() => deleteText(quote.id)} testID={`deleteQuote-${quote.id}`}></CloseButton>
            </div>
            {/* {
                editQuoteModal && 
                    <Modal onClick={() => {setEditQuoteModal(false)}}>
                        <TextArea heading={"EDIT TEXT"} text={quote.text} setText={setText} handleTextSave={handleTextSave}></TextArea>
                    </Modal>
            } */}
        </>
    )
}
export {QuoteBlock}