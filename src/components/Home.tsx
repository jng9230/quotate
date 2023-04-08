import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { book, booksReturnType, quote, quotesReturnType, newBookReturnType, deleteBookReturnType, userReturnType} from "./APIReturnTypes"
import { BiPlus, BiMinus } from "react-icons/bi"
import { Modal } from "./Modal";
const API_BASE = "http://localhost:5000";
const basic_button_classes = `
    btn-std 
    border-std 
    border-main-green 
    text-main-green 
    bg-white 
`

function Home(){
    const [books, setBooks] = useState<book[]>([])
    const [quotes, setQuotes] = useState<quote[]>()
    const getBooks = () => {
        if (user === undefined){ return;}
        fetch(API_BASE + "/book/book/all_for_user/" + user._id, {
        })
            .then(res => res.json())
            .then(data => {
                const data1 = data as booksReturnType[];
                let mapped_books = data1.map(d => {
                    return {
                        title: d.title,
                        id: d._id
                    }
                })
                setBooks(mapped_books.reverse());
            })
            .catch(err => console.error("Error: ", err))
    }

    const getQuotes = () => {
        if (focusedBook === undefined){return;}
        // console.log(`GETTING QUOTES FOR ${focusedBook.title}`)
        fetch(API_BASE + `/quote/quote/all_for_book/${focusedBook.id}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                const data1 = data as quotesReturnType[];
                let mapping = data1.map(d => {
                    return {
                        text: d.text,
                        id: d._id,
                        book: d.book
                    }
                })
                setQuotes(mapping.reverse())
            })
            .catch(err => console.error("Error: ", err))
    }
    const [focusedBook, setFocusedBook] = useState<book>();
    const handleFocusedBookClick = (e: React.MouseEvent<HTMLDivElement>, key: string) => {
        const spec_book = books.filter(d => d.id === key)[0];
        if (focusedBook === spec_book){
            setFocusedBook(undefined)
        } else {
            setFocusedBook(spec_book)
        }
    }

    useEffect(() => {
        getQuotes()
    }, [focusedBook])

    const [addBookModal, setAddBookModal] = useState(false);
    const [newBookName, setNewBookName] = useState("")
    const handleAddNewBook = () => {
        if (user === undefined){return;}
        //send RQ to server 
        fetch(API_BASE + "/book/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "title": newBookName, 
                "user_id": user._id
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const data1 = data as newBookReturnType;
                const newBook:book = {
                    title: newBookName,
                    id: data1._id
                }
                setBooks([newBook, ...books])
                setAddBookModal(false)
                setFocusedBook(newBook)
                setNewBookName("")
            })
            .catch(err => console.error("Error: ", err))
    }

    const [deleteBookModal, setDeleteBookModal] = useState(false);
    const deleteBook = () => {
        setDeleteBookModal(true);
    }
    
    const confirmDelete = () => {
        if (!focusedBook){return}
    
        fetch(API_BASE + "/book/book", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "id": focusedBook.id })
        })
            .then(res => res.json())
            .then(data => {
                let data1 = data as deleteBookReturnType;
                console.log(data1);
                setBooks(books.filter(d => d.id != data1.book._id))
                setFocusedBook(undefined)
                setDeleteBookModal(false)
            })
            .catch(err => console.error("Error: ", err))

    }
    
    const [authed, setAuthed] = useState(false);
    const [user, setUser] = useState<userReturnType>();
    useEffect(() => {
        // console.log("getting auth stuff")
        fetch(API_BASE + "/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
            }
        })
        // const params = new Proxy(new URLSearchParams(window.location.search), {
        //     get: (searchParams, prop:string) => searchParams.get(prop),
        // });
        // let value = params.token;
        // fetch(API_BASE + "/get_details", {
        //     method: "GET",
        //     credentials: "include",
        //     headers: {
        //         // Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7fSwiaWQiOiI2NDIzOTg0Y2Q5OWUxYTRhN2NiNThlYTYiLCJpYXQiOjE2ODA5OTA4NDl9.N2fjcmSDXpyFk5aUcxrXOYwTGWOST6Q4oIcZxLS9Ieg"
        //         authorization: "JWT"
        //     }
        // })
            .then(res => {
                if (res.status === 200) return res.json();
                throw new Error("failed to authenticate user");
            })
            .then(data => {
                console.log(data);
                // console.log(data.user.google_name);
                setUser(data.user)
                setAuthed(true);
            })
            .catch(err => {
                console.error("Failed to authenticate user.", err)
                setAuthed(false)
            })
    }, [])
    const handleLogin = () => {
        window.open(API_BASE + "/auth/google", "_self");
    }
    const handleLogout = () => {
        window.open(API_BASE + "/auth/logout", "_self");
        setAuthed(false);
    }

    useEffect(() => {
        if (user){
            getBooks()
        }
    }, [user])

    return (
        <div className="w-screen h-screen flex flex-col bg-off-white">
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
                        "
                        onClick={() => {setAddBookModal(true) }}
                        >
                        <BiPlus className="mr-2"/>
                        BOOK
                    </button>
                </div>
                <div className="col-start-2 col-span-full flex w-full justify-between">
                    <div className="bg-black border-black border-std w-4/5"></div>
                    {
                        !authed ? <button onClick={handleLogin} className={basic_button_classes}> Login</button>
                        : <button onClick={handleLogout} className={basic_button_classes}> Logout </button>
                    }
                </div>
            </header>
            <div className="w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 pt-0 overflow-hidden">
                <div className="row-span-full border-std p-3 space-y-3 bg-white">
                    {
                        books.map((d, i) => {
                            const key = d.id
                            return (
                                <div key={key} 
                                    className={`
                                        border-std 
                                        p-1 
                                        cursor-pointer 
                                        hover:ease-in 
                                        hover:text-white 
                                        transition 
                                        ease-out 
                                        hover:translate-x-1
                                        text-ellipsis 
                                        overflow-hidden 
                                        whitespace-nowrap
                                        ${
                                            focusedBook?.id == key ? "bg-main-green text-white" 
                                            : "hover:bg-secondary-green"
                                        }
                                    `}
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
                    bg-white
                    overflow-y-scroll
                    ">
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
                            <button onClick={() => deleteBook()}
                                className="
                                    btn-std
                                    border-std
                                    border-red-600
                                    text-red-600
                                    flex
                                    items-center
                                    mx-auto
                                ">
                                <BiMinus className="mr-2"/> REMOVE BOOK
                            </button>
                        </>
                    }
                </div>
            </div>
            {
                addBookModal && 
                <Modal onClick={() => setAddBookModal(false)}>
                    <div className="w-full h-full flex flex-col items-center space-y-5">
                        <label htmlFor="bookName"> ADD A NEW BOOK </label>
                        <input type="text" id="bookName" name="bookName" placeholder="Enter book name"
                            className="
                                border-std
                                border-black
                                text-center
                                outline-none
                                p-1
                                w-full
                                sm:w-1/2
                            "
                            value={newBookName}
                            onChange={e => setNewBookName(e.target.value)}
                        />
                        <button className="
                            btn-std 
                            text-main-green 
                            border-std 
                            bg-white 
                            border-main-green
                            flex
                            items-center
                        "
                            onClick={handleAddNewBook}
                        >
                            {/* <BiPlus className=""/>  */}
                            ADD
                        </button>
                    </div>
                </Modal>
            }
            {
                deleteBookModal &&
                <Modal onClick={() => setDeleteBookModal(false)}>
                    <div className="w-full h-full flex flex-col items-center space-y-5">
                        <div>
                            DELETE "{focusedBook?.title}"?
                        </div>
                        <div className="flex space-x-6">
                            <button className="
                                btn-std 
                                text-main-green 
                                border-std 
                                bg-white 
                                border-main-green
                                flex
                                items-center
                            "
                                onClick={() => confirmDelete()}
                            >
                                YES
                            </button>
                            <button className="
                                btn-std 
                                text-main-green 
                                border-std 
                                bg-white 
                                border-main-green
                                flex
                                items-center
                            "
                                onClick={() => setDeleteBookModal(false)}
                            >
                                NO
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </div>
        
    )
}

export {Home}