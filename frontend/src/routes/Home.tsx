// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { book, quote, userReturnType} from "../utils/APIReturnTypes"
// import { BiPlus, BiMinus } from "react-icons/bi"
import { Modal } from "../components/Modal";
import { HomeHeader } from "../components/HomeHeader";
import { BooksWrapper } from "../components/BooksWrapper";
import { QuotesWrapper } from "../components/QuotesWrapper";
import { getBooksForUser, getQuotesForBook, addNewBook, deleteBook, getAuthedUser, editBook, deleteQuote, editQuote } from "../utils/apiCalls";
import { Login } from "../components/Login";
// import { useParams, useSearchParams } from "react-router-dom";
import { Loading } from "./Loading";

function Home(){
    const [books, setBooks] = useState<book[]>([])

    const [focusedBook, setFocusedBook] = useState<book>();
    const handleFocusedBookClick = (e: React.MouseEvent<HTMLDivElement>, key: string) => {
        const spec_book = books.filter(d => d.id === key)[0];
        if (focusedBook === spec_book){
            setFocusedBook(undefined)
        } else {
            setFocusedBook(spec_book)
        }
    }
    
    const [addBookModal, setAddBookModal] = useState(false);
    const [newBookName, setNewBookName] = useState("")
    //new book wants to be added -> call backend, update modals
    const handleAddNewBook = () => {
        if (user === undefined){
            console.error("NO USER PROVIDED/NOT LOGGED IN"); 
            return;
        }

        addNewBook(newBookName, user)
            .then(data => {
                const newBook:book = {
                    title: newBookName,
                    id: data._id
                }
                setBooks([newBook, ...books])
                setAddBookModal(false)
                setFocusedBook(newBook)
                setNewBookName("")
            })
            .catch(err => console.error("Error: ", err))
    }

    const [deleteBookModal, setDeleteBookModal] = useState(false);
    //user clicks delete button -> bring up modal to confirm
    const handleDeleteBook = () => {
        setDeleteBookModal(true);
    }
    //user confirms -> API calls, etc.
    const confirmDelete = () => {
        if (!focusedBook){return}
    
        deleteBook(focusedBook)
            .then(data => {
                setBooks(books.filter(d => d.id !== data.book._id))
                setFocusedBook(undefined)
                setDeleteBookModal(false)
            })
            .catch(err => console.error(err))
    }
    
    const [user, setUser] = useState<userReturnType>();
    const authed = user !== undefined;
    //auth status changes -> reset user based on auth token
    useEffect(() => {
        // if (token === undefined || token === null){console.error("NO TOKEN PROVIDED");return;}
        // if (!authed) {
        //     window.open("/login", "_self");
        // } else {
        // }
        getAuthedUser()
            .then(res => {
                setUser(res);
                getBooksForUser(res)
                    .then(res => {
                        const mapped_books = res.map(d => {
                            return {
                                title: d.title,
                                id: d._id
                            }
                        })
                        setBooks(mapped_books.reverse());
                    })
                    .catch(err => console.error("Error: ", err))
            })
            .catch(err => {
                console.log("the fuck")
                console.error(err);
                setLoading(false);
            })
            .finally(() => setLoading(false))
    }, [authed])

    const [editBookModal, setEditBookModal] = useState(false);
    const showBookModal = () => {setNewBookName(focusedBook?.title || ""); setEditBookModal(true)}
    const handleEditBook = () => {
        if (focusedBook === undefined) {
            console.error("NO FOCUSED BOOK");
            return;
        }

        editBook(newBookName, focusedBook.id)
            .then(data => {
                const editedBook: book = {
                    title: newBookName,
                    id: data._id
                }
                const editedBooks = books.map(d => {
                    if (d.id == editedBook.id){
                        return {
                            title: newBookName,
                            id: d.id
                        }
                    }
                    return d
                })
                setBooks(editedBooks)
                setEditBookModal(false)
                setFocusedBook(editedBook)
                setNewBookName("")
            })
            .catch(err => console.error("Error: ", err))
    }

    const [loading, setLoading] = useState(true);
    if (loading){
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-off-white">
                <Loading/>
            </div>
        )
    } 
    
    return (
        <>
            {
                !authed ? <Login/> :
            <div className="w-screen h-screen flex flex-col bg-off-white">
                <HomeHeader 
                    setAddBookModal={setAddBookModal} 
                    authed={authed}
                ></HomeHeader>
                <main className="w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 pt-0 overflow-hidden">
                    <BooksWrapper 
                        books={books}
                        focusedBook={focusedBook}
                        handleFocusedBookClick={handleFocusedBookClick}
                        showBookModal={showBookModal}
                    ></BooksWrapper>
                    <QuotesWrapper
                        focusedBook={focusedBook}
                        // quotes={quotes}
                        handleDeleteBook={handleDeleteBook}
                        // deleteText={deleteText}
                        // handleTextSave={handleTextSave}
                    ></QuotesWrapper>
                </main>
                {
                    addBookModal && 
                    <Modal onClick={() => setAddBookModal(false)} testID={"closeAddBookModal"}>
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
                {
                    editBookModal && 
                    <Modal onClick={() => setEditBookModal(false)}>
                        <div className="w-full h-full flex flex-col items-center space-y-5">
                                <label htmlFor="bookName"> EDIT BOOK TITLE </label>
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
                                    onClick={handleEditBook}
                                >
                                    UPDATE
                                </button>           
                        </div>
                    </Modal>
                }
            </div>
            }
        </>
    )
}

export {Home}