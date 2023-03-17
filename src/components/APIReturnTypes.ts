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

export type quote = {
    text: string,
    book: string,
    id: string
}
