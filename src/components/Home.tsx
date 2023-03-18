import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TiPlus} from "react-icons/ti";
import {book, booksReturnType, quote, quotesReturnType} from "./APIReturnTypes"
import { BiPlus } from "react-icons/bi"
const API_BASE = "http://localhost:5000";

function Home(){
    const [books, setBooks] = useState<book[]>([])
    const [quotes, setQuotes] = useState<quote[]>()
    useEffect(() => {
        getBooks()
    }, [])

    const getBooks = () => {
        fetch(API_BASE + "/book/all")
        .then(res => res.json())
        .then(data => {
            const data1 = data as booksReturnType[];
            setBooks(data1.map(d => {
                return {
                    title: d.title,
                    id: d._id
                }
            }))
        })
        .catch(err => console.error("Error: ", err))
    }

    const getQuotes = () => {
        if (focusedBook === undefined){return;}
        console.log(`GETTING QUOTES FOR ${focusedBook.title}`)
        fetch(API_BASE + `/quote/id/${focusedBook.id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const data1 = data as quotesReturnType[];
            setQuotes(data1.map(d => {
                return {
                    text: d.text,
                    id: d._id,
                    book: d.book
                }
            }))
        })
        .catch(err => console.error("Error: ", err))
    }
    
    const [focusedBook, setFocusedBook] = useState<book>();
    const handleFocusedBookClick = (e: React.MouseEvent<HTMLDivElement>, key: string) => {
        const spec_book = books.filter(d => d.id === key)[0];
        setFocusedBook(spec_book)
    }
    useEffect(() => {
        getQuotes()
    }, [focusedBook])

    const addQuotesButton = () => {
        if (focusedBook == undefined){return;}

        return (
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
                    `}>
                    <BiPlus className="mr-2" /> QUOTE
                </button>
            </Link>
        )
    }

    return (
        <div className="flex flex-col w-screen h-screen bg-off-white">
            <header className="grid grid-cols-3 gap-3 p-3">
                <div className="">
                    <button className="btn-std 
                            border-main-green 
                            border-std 
                            bg-white
                            text-main-green
                            flex
                            items-center
                            transition 
                            ease-out
                            hover:scale-105
                        ">
                        <BiPlus className="mr-2"/>
                        BOOK
                    </button>
                </div>
                <div className="col-start-2 col-span-full border-std border-black bg-black">
                </div>
            </header>
            <div className="w-full h-full grid grid-cols-3 gap-3 p-3 pt-0">
                <div className="row-span-full border-std p-3 space-y-3 bg-white">
                    {
                        books.map((d, i) => {
                            const key = d.id
                            let styles = `border-std p-1 cursor-pointer hover:ease-in 
                            hover:text-white transition ease-out hover:translate-x-1`
                            if (focusedBook?.id){
                                styles += key == focusedBook.id ? " bg-main-green text-white" : " hover:bg-secondary-green";
                            }
                            return (
                                <div key={key} 
                                    className={styles}
                                    onClick={e => handleFocusedBookClick(e, key)}>
                                    {d.title}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="
                    col-start-2 
                    col-span-full 
                    row-span-full
                    space-y-3
                    p-3
                    border-std
                    bg-white">
                    { focusedBook && 
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
                            {addQuotesButton()}
                        </>
                    }
                </div>
            </div>
        </div>
        
    )
}

export {Home}