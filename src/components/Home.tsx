import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE = "http://localhost:5000"
function Home(){
    const [books, setBooks] = useState<string[]>([])
    useEffect(() => {
        getBooks()
    }, [])

    const getBooks = () => {
        fetch(API_BASE + "/book/all")
        .then(res => res.json())
        .then(data => 
            console.log(data)
        )
        .catch(err => console.error("Error: ", err))
    }
    
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
            <div className="bg-black row-start-2 row-span-full">

            </div>
            <div className="bg-gray-500 col-start-2 col-span-full">

            </div>
            <div className="bg-red-200 col-start-2 row-start-2 col-span-full row-span-full">

            </div>
        </div>
        
    )
}

export {Home}