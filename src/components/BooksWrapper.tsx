import { book } from "../utils/APIReturnTypes"

function BooksWrapper({
    books,
    focusedBook,
    handleFocusedBookClick
}:{
    books:book[],
    focusedBook: book | undefined, 
    handleFocusedBookClick: (e: React.MouseEvent<HTMLDivElement>, key:string) => void
}){
    return (
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
                                        ${focusedBook?.id === key ? "bg-main-green text-white"
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
    )
}

export {BooksWrapper}