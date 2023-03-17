import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE = "http://localhost:5000"

type book = {
    title: string,
    id: string
}

type booksReturnType = {
    title: string, 
    __v: number,
    _id: string
}

type quotesReturnType = {
    _id: string,
    text: string,
    book: string,
    __v: number
}

type quote = {
    text: string,
    book: string,
    id: string
}

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
        fetch(API_BASE + "/quote/id", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": focusedBook.id
            })
        })
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
    return (
        <div className="w-screen h-screen grid grid-rows-8 grid-cols-3 gap-5 p-3">
            <div className="absolute right-0 top-0">
                HOME PENIS HOME PENIS HOME
                <Link to="./app">
                    <button className="btn-std text-white bg-main-green">
                        bro
                    </button>
                </Link>
            </div>
            <div className="bg-main-green">
                
            </div>
            <div className="row-start-2 row-span-full border-std p-3 space-y-3">
                {
                    books.map((d, i) => {
                        const key = d.id
                        return (
                            <div key={key} 
                                className="border-std p-1 cursor-pointer"
                                onClick={e => handleFocusedBookClick(e, key)}>
                                {d.title}
                            </div>
                        )
                    })
                }
            </div>
            <div className="bg-gray-500 col-start-2 col-span-full">

            </div>
            <div className="bg-red-200 col-start-2 row-start-2 col-span-full row-span-full">

            </div>
        </div>
        
    )
}

export {Home}