import { cleanup, render, screen } from '@testing-library/react';
import { Home } from '../routes/Home';
import { BooksWrapper } from '../components/BooksWrapper';
import { QuotesWrapper } from '../components/QuotesWrapper';
import '@testing-library/jest-dom';
// global.fetch = require('jest-fetch-mock') //mock fetch RQs
const fetchMock = require('fetch-mock-jest');
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event';

afterEach(() => {
    cleanup(); //reset JSDom
})

describe("quote wrapper", () => {
    test("nothing but buttons on empty quotes arr", async () => {
        const quotes = []
        render(<QuotesWrapper quotes={quotes} focusedBook={null}></QuotesWrapper>)

        expect(screen.getByTestId("quotesWrapper")).toBeEmptyDOMElement();
    })
    test("still nothing w/o focused book", async () => {
        const quotes = [{
            text: "text1",
            id: "id1",
            book: "book1"
        }, {
            text: "text2",
            id: "id2",
            book: "book2"
        }];
        render(<QuotesWrapper quotes={quotes} focusedBook={null}></QuotesWrapper>)
        expect(screen.getByTestId("quotesWrapper")).toBeEmptyDOMElement();
    })

    //CAN'T TEST SHOWING QUOTES B/C IT DROPS A <link> -> need a to wrap in react router before using
    // -> can only test in <home> (?)
    // test("focused book -> quotes show", async () => {
    //     const quotes = [{
    //         text: "text1",
    //         id: "id1",
    //         book: "book1"
    //     }, {
    //         text: "text2",
    //         id: "id2",
    //         book: "book1"
    //     }];
    //     const book = {
    //         title: "book1",
    //         id: "id3"
    //     };
    //     render(<QuotesWrapper quotes={quotes} focusedBook={book}></QuotesWrapper>)
    //     expect(screen.getByText("text1")).toBeInTheDocument();
    //     expect(screen.getByText("text2")).toBeInTheDocument();
    // })

})

describe("book wrapper", () => {
    test("nothing on empty books arr", async () => {
        const books = []
        render(<BooksWrapper books={books}></BooksWrapper>)

        expect(screen.getByTestId("booksWrapper")).toBeEmptyDOMElement();
    })
    test("something on non-empty books arr", async () => {
        const books = [{
            title: "title1",
            id: "id1"
        }, {
            title: "title2",
            id: "id2"
        }];
        render(<BooksWrapper books={books}></BooksWrapper>)
        expect(screen.getByText("title1")).toBeInTheDocument();
        expect(screen.getByText("title2")).toBeInTheDocument();
        //don't test key b/c that's under the hood -- test via integration of book & quotes
    })
})


describe("home", () => {
    beforeEach(() => {
        fetchMock.restore();
        render(<Home />);
    })

    test("buttons on load", async () => {
        // fetchMock.mock("http://example.com", 200);
        // const res = await fetch("http://example.com");
        // expect(res.ok).toEqual(true);
        // expect(res.status).toEqual(200)
        expect(screen.getByText("LOGIN")).toBeInTheDocument();
        expect(screen.getByText("BOOK")).toBeInTheDocument(); //add books button
    })

    test("empty quote and book wrappers", async () => {
        const main = screen.getByRole("main");
        // const wrappers = screen.getAllByRole("section")
        // expect(wrappers).toBeEmptyDOMElement();
        expect(screen.getByTestId("booksWrapper")).toBeEmptyDOMElement();
        expect(screen.getByTestId("quotesWrapper")).toBeEmptyDOMElement();
    })

    describe("adding a book", () => {
        test("add button -> book modal is shown", async () => {
            const user = userEvent.setup()
            const addButton = screen.getByRole("button", {name: "BOOK"});
            expect(addButton).toBeInTheDocument();
            await user.click(addButton)
            const bookModal = screen.getByText("ADD A NEW BOOK")
            expect(bookModal).toBeInTheDocument();
        })

        //typing in book name, adding, etc. 
    })

})