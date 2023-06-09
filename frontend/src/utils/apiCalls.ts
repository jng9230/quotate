// import { useParams } from "react-router-dom";
import { config } from "./config"
import * as API from "./APIReturnTypes"

// const API_BASE = config.API_BASE; 
// const token = useParams().token;

export const getAuthedUser = async () => {
    const res = fetch("/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
        }
    })
        // const res = fetch("/get_details/?token="+token, {
        // })
        .then(res => {
            if (res.status === 200) return res.json()
            throw new Error("failed to authenticate user");
        })
        .then(data => {
            return data.user as API.userReturnType
        })
    return res
}

export const getBooksForUser = async (user: API.userReturnType) => {
    const res = fetch("/book/all_for_user/" + user._id)
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.booksReturnType[];
            return data1
        })
    
    return res
}

export const getQuotesForBook = async (bookID:string) => {
    const res = fetch(`/quote/all_for_book/${bookID}`)
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.quotesReturnType[];
            return data1
        })

    return res
}

export const addNewBook = async (bookName:string, user: API.userReturnType) => {
    const res = fetch("/book", {
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
            const data1 = data as API.newBookReturnType;
            return data1
        })
    return res
}

export const editBook = async (bookName: string, bookID: string) => {
    const res = fetch("/book", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "title": bookName,
            "id": bookID
        })
    })
        .then(res => res.json())
        .then(data => {
            const data1 = data as API.newBookReturnType;
            return data1
        })
    return res
}

export const deleteBook = async (focusedBook:API.book) => {
    const res = fetch("/book", {
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

export const getBookTitle = async (bookID:string) => {
    const res = fetch(`/book/id/${bookID}`)
        .then(res => res.json())
        .then(data => {
            return data as API.booksReturnType;
        })
    return res
}

export const addNewQuote = async (new_text:string, bookID:string, user:API.userReturnType) => {
    const res = fetch("/quote", {
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

export const deleteQuote = async (id:string) => {
    const res = fetch("/quote", {
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

export const editQuote = async (id:string, newText:string) => {
    const res = fetch("/quote", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "id": id, "text": newText })
    })
        .then(res => res.json())
        .then(data => {
            return data as API.newQuoteReturnType;
        })
    return res
}