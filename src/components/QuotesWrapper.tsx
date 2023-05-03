import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { book, quote } from "../utils/APIReturnTypes"
import { BiPlus, BiMinus } from "react-icons/bi"

function QuotesWrapper({
    focusedBook,
    quotes,
    handleDeleteBook
}: {
    focusedBook: book | undefined,
    quotes: quote[] | undefined, 
    handleDeleteBook: () => void
}){
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
                    {quotes?.map((d, i) => {
                        const key = d.id;
                        return (
                            <div key={key}
                                className="border-std border-black p-1">
                                {d.text}
                            </div>
                        )
                    })}
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