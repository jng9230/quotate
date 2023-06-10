import { Link } from "react-router-dom";
import { book, quote } from "../utils/APIReturnTypes"
import { BiPlus, BiMinus } from "react-icons/bi"
import { QuoteBlock } from "./QuoteBlock";
import { useState, useEffect } from "react";
import { editQuote, getQuotesForBook, deleteQuote } from "../utils/apiCalls";
import { Modal } from "./Modal";
import { TextArea } from "./TextArea";
function QuotesWrapper({
    focusedBook,
    // quotes,
    handleDeleteBook,
    // deleteText,
    // handleTextSave
}: {
    focusedBook: book | undefined,
    // quotes: quote[] | undefined, 
    handleDeleteBook: () => void,
    // deleteText: (id:string) => void
    // handleTextSave: (newText:string) => void
}){
    const [quotes, setQuotes] = useState<quote[]>([])

    //update displayed quotes whenever the focused book changes
    useEffect(() => {
        if (focusedBook === undefined) { return; }
        getQuotesForBook(focusedBook.id)
            .then(data1 => {
                let mapping = data1.map(d => {
                    return {
                        text: d.text,
                        id: d._id,
                        book: d.book
                    }
                })
                setQuotes(mapping.reverse())
            })
            .catch(err => console.error(err))
    }, [focusedBook])

    const [focusedQuote, setFocusedQuote] = useState<quote>({text:"", book:"", id:""});
    const [editQuoteModal, setEditQuoteModal] = useState(false);

    const handleTextSave = (newText: string) => {
        //return if nothing has changed
        if (focusedQuote === undefined || newText === focusedQuote?.text) { return; }

        editQuote(focusedQuote.id, newText)
            .then(data => {
                const newQuote = {
                    text: newText,
                    book: data.book,
                    id: data._id
                }
                setQuotes(quotes?.map(d => {
                    if (d.id === focusedQuote.id) {
                        return newQuote
                    }
                    return d
                }))
                setEditQuoteModal(false);

            })
            .catch(err => console.error(err))
    }

    function deleteText(id: string) {
        deleteQuote(id)
            .then(data => {
                const filteredQuotes = quotes?.filter((d) => d.id !== data.result._id);
                setQuotes(filteredQuotes);
            })
            .catch(err => console.error(err))
    }

    const [editText, setEditText] = useState(focusedQuote?.text);
    return (
        <div className="
                    col-start-2 
                    col-span-full 
                    row-span-full
                    space-y-3
                    p-3
                    border-std
                    bg-white
                    overflow-y-scroll
                    "
            data-testid="quotesWrapper"
        >
            {focusedBook &&
                <>
                    {
                        quotes?.map((d, i) => {
                            const key = d.id;
                            return (
                                <QuoteBlock 
                                    quote={d} 
                                    deleteText={deleteText} 
                                    setQuotes={setQuotes} 
                                    handleTextSave={handleTextSave}
                                    setFocusedQuote={setFocusedQuote}
                                    editQuoteModal={editQuoteModal}
                                    setEditQuoteModal={setEditQuoteModal}
                                    setEditText={setEditText}
                                /> 
                            )
                        })
                    }
                    {
                        editQuoteModal &&
                            <Modal onClick={() => { setEditQuoteModal(false) }}>
                            <TextArea heading={"EDIT TEXT"} text={editText} setText={setEditText} handleTextSave={handleTextSave}></TextArea>
                            </Modal>
                    }
                    {
                        focusedBook &&
                        <Link to={`./app/${focusedBook.id}`}>
                            <button className={`
                                        flex 
                                        items-center 
                                        btn-std 
                                        border-2 
                                        border-main-green 
                                        mx-auto
                                        text-main-green
                                        ${quotes?.length ? "mt-3" : ""}
                                        `}
                            >
                                <BiPlus className="mr-2" /> QUOTE
                            </button>
                        </Link>
                    }
                    <button onClick={() => handleDeleteBook()}
                        className="
                                    btn-std
                                    border-std
                                    border-red-600
                                    text-red-600
                                    flex
                                    items-center
                                    mx-auto
                                ">
                        <BiMinus className="mr-2" /> REMOVE BOOK
                    </button>
                </>
            }
        </div>
    )
}

export {QuotesWrapper}