// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { book, quote, userReturnType} from "../utils/APIReturnTypes"
// import { BiPlus, BiMinus } from "react-icons/bi"
import { Modal } from "../components/Modal";
import { HomeHeader } from "../components/HomeHeader";
import { BooksWrapper } from "../components/BooksWrapper";
import { QuotesWrapper } from "../components/QuotesWrapper";
import { getBooksForUser, getQuotesForBook, addNewBook, deleteBook, getAuthedUser } from "../utils/apiCalls";
// import { useParams, useSearchParams } from "react-router-dom";

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

    const [focusedBook, setFocusedBook] = useState<book>();
    const handleFocusedBookClick = (e: React.MouseEvent<HTMLDivElement>, key: string) => {
        const spec_book = books.filter(d => d.id === key)[0];
        if (focusedBook === spec_book){
            setFocusedBook(undefined)
        } else {
            setFocusedBook(spec_book)
        }
    }
    
    // const [searchParams, setSearchParams] = useSearchParams();
    // console.log(searchParams.entries());
    // const token = useParams().token;
    // const token = useParams().token;
    // const token = searchParams.get('token');
    // console.log("TOKEN: " + token)

    //focused book changes -> get quotes from backend
    useEffect(() => {
        if (focusedBook === undefined){return;}
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

    const [addBookModal, setAddBookModal] = useState(false);
    const [newBookName, setNewBookName] = useState("")
    //new book wants to be added -> call backend, update modals
    const handleAddNewBook = () => {
        if (user === undefined){return;}
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
        getAuthedUser()
            .then(res => {
                setUser(res);
            })
            .catch(err => console.error(err))
    }, [authed])

    //get books for user
    useEffect(() => {
        if (user === undefined){return;}

        getBooksForUser(user)
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
    }, [user])

    return (
        <div className="w-screen h-screen flex flex-col bg-off-white">
            <HomeHeader 
                setAddBookModal={setAddBookModal} 
                authed={authed}
                basic_button_classes={basic_button_classes}
            ></HomeHeader>
            <main className="w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 pt-0 overflow-hidden">
                <BooksWrapper 
                    books={books}
                    focusedBook={focusedBook}
                    handleFocusedBookClick={handleFocusedBookClick}
                ></BooksWrapper>
                <QuotesWrapper
                    focusedBook={focusedBook}
                    quotes={quotes}
                    handleDeleteBook={handleDeleteBook}
                ></QuotesWrapper>
            </main>
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