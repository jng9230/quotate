import * as API from "../utils/APIReturnTypes";

export const user_id = "u01234567";
export const book1_title = "book1 title";
export const book1_id = "b987654321";
export const quote1_id = "q987654321";
export const quote1_text = "quote 1 text hello world";


export const user: API.userReturnType = {
    google_id: "123456789",
    google_name: "john doe",
    _id: user_id,
    __v: "0"
}

export const book1: API.booksReturnType = {
    title: book1_title,
    _id: book1_id,
    __v: 0
}

export const quote1: API.quotesReturnType = {
    _id: quote1_id,
    text: quote1_text,
    book: book1_id,
    __v: 0
}

export const book1_added: API.newBookReturnType = {
    __v: 0,
    _id: book1_id
}

export const book1_deleted: API.deleteBookReturnType = {
    book: book1, 
    quotes: [quote1]
}

export const quote1_added: API.newQuoteReturnType = {
    _id: quote1_id,
    text: quote1_text,
    book: book1_id
}

export const quote1_deleted: API.deleteQuoteReturnType = {
    result: quote1
}