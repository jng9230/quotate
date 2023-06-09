import { book } from "../utils/APIReturnTypes"
import { BiPencil } from "react-icons/bi";

function BooksWrapper({
    books,
    focusedBook,
    handleFocusedBookClick,
    showBookModal
}:{
    books: book[],
    focusedBook: book | undefined, 
    handleFocusedBookClick: (e: React.MouseEvent<HTMLDivElement>, key:string) => void,
    showBookModal: () => void,
}){
    return (
        <div className="row-span-full border-std p-3 space-y-3 bg-white" data-testid="booksWrapper">
            {
                books.map((d, i) => {
                    const key = d.id;
                    const isFocused = key === focusedBook?.id;
                    return (
                        <div key={key}
                            className={`
                                border-std 
                                cursor-pointer 
                                hover:ease-in 
                                hover:text-white 
                                transition 
                                ease-out 
                                hover:translate-x-1
                                text-ellipsis 
                                overflow-hidden 
                                whitespace-nowrap
                                ${isFocused ? "bg-main-green text-white"
                                    : "bg-white text-black hover:bg-secondary-green"
                                }
                                flex
                                flex-row
                                justify-between
                                items-center
                                px-1
                            `}>
                            <p onClick={e => handleFocusedBookClick(e, key)} className="py-1 w-full">
                                {d.title}
                            </p>
                            { isFocused && <BiPencil onClick={() => {showBookModal()}}></BiPencil> }
                        </div>
                    )
                })
            }
        </div>
    )
}

export {BooksWrapper}