export type book = {
    title: string,
    id: string
}

export type booksReturnType = {
    title: string,
    __v: number,
    _id: string
}

export type quotesReturnType = {
    _id: string,
    text: string,
    book: string,
    __v: number
}

export type newQuoteReturnType = {
    _id: string,
    text: string,
    book: string,
}

export type quote = {
    text: string,
    book: string,
    id: string
}

export type newBookReturnType = {
    __v: number,
    _id: string
}

export type deleteBookReturnType = {
    result: booksReturnType
}

export type deleteQuoteReturnType = {
    result: quotesReturnType
}