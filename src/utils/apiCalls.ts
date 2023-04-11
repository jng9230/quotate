import { config } from "../config"
import * as API from "./APIReturnTypes"

const API_BASE = config.API_BASE; 

const getBooksForUser = async (user: API.userReturnType) => {
    const res = fetch(API_BASE + "/book/book/all_for_user/" + user._id)
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.booksReturnType[];
            return data1
        })
    
    return res
}

const getQuotesForBook = async (bookID:string) => {
    const res = fetch(API_BASE + `/quote/quote/all_for_book/${bookID}`)
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.quotesReturnType[];
            return data1
        })

    return res
}

const addNewBook = async (bookName:string, user: API.userReturnType) => {
    const res = fetch(API_BASE + "/book/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "title": bookName,
            "user_id": user._id
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const data1 = data as API.newBookReturnType;
            return data1
        })
    return res
}

const deleteBook = async (focusedBook:API.book) => {
    const res = fetch(API_BASE + "/book/book", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "id": focusedBook.id })
    })
        .then(res => res.json())
        .then(data => {
            return data as API.deleteBookReturnType;
        })
    return res
}

const getAuthedUser = async () => {
    const res = fetch(API_BASE + "/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
        }
    })
        .then(res => {
            if (res.status === 200) return res.json();
            throw new Error("failed to authenticate user");
        })
        .then(data => {
            return data.user as API.userReturnType
        })
    return res
}

const getBookTitle = async (bookID:string) => {
    const res = fetch(API_BASE + `/book/book/id/${bookID}`)
        .then(res => res.json())
        .then(data => {
            return data as API.booksReturnType;
        })
    return res
}

const addNewQuote = async (new_text:string, bookID:string, user:API.userReturnType) => {
    const res = fetch(API_BASE + "/quote/quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "text": new_text, "book": bookID, "user_id": user._id })
            //TODO: handle bookID undefined case
        })
            .then(res => res.json())
            .then(data => {
                return data as API.newQuoteReturnType;
            })
    return res
}

const deleteQuote = (id:string) => {
    const res = fetch(API_BASE + "/quote/quote", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "id": id })
    })
        .then(res => res.json())
        .then(data => {
            return data as API.deleteQuoteReturnType;
        })
    return res
}

export { 
    getBooksForUser, 
    getQuotesForBook,
    addNewBook,
    deleteBook,
    getAuthedUser,
    getBookTitle,
    addNewQuote,
    deleteQuote
}