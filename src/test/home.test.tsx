import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '../routes/Home';
import { BooksWrapper } from '../components/BooksWrapper';
import { QuotesWrapper } from '../components/QuotesWrapper';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');
import { within, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event';
import { server } from './mockServer'
import * as API from "../utils/APIReturnTypes";
import * as data from "./mockData";
import { BrowserRouter as Router, Routes, Route, MemoryRouter } from 'react-router-dom'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers(); //reset handlers to ensure test isolation
    cleanup(); //reset JSDom
})
afterAll(() => server.close())


describe("quote wrapper", () => {
    test("nothing but buttons on empty quotes arr", async () => {
        const quotes: API.quote[] = []
        render(<QuotesWrapper quotes={quotes} focusedBook={undefined} handleDeleteBook={()=>{}}></QuotesWrapper>)

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
        render(<QuotesWrapper quotes={quotes} focusedBook={undefined} handleDeleteBook={()=>{}}></QuotesWrapper>)
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
        const books:API.book[] = []
        render(<BooksWrapper books={books} handleFocusedBookClick={()=>{}} focusedBook={undefined}></BooksWrapper>)

        expect(screen.getByTestId("booksWrapper")).toBeEmptyDOMElement();
    })
    test("something on non-empty books arr", async () => {
        // const books = [{
        //     title: "title1",
        //     id: "id1"
        // }, {
        //     title: "title2",
        //     id: "id2"
        // }];
        const books = [data.book1];
        render(<BooksWrapper books={books} handleFocusedBookClick={() => { }} focusedBook={undefined}></BooksWrapper>)
        // expect(screen.getByText("title1")).toBeInTheDocument();
        // expect(screen.getByText("title2")).toBeInTheDocument();
        expect(screen.getByText(data.book1_title)).toBeInTheDocument();
        //don't test key b/c that's under the hood -- test via integration of book & quotes
    })
})


describe("home", () => {
    beforeEach(() => {
        // fetchMock.restore();
        // render(<Home />);
    })

    test("buttons on load", async () => {
        render(<Home />);
        expect(screen.getByText("LOGIN")).toBeInTheDocument();
        expect(screen.getByText("BOOK")).toBeInTheDocument(); //add books button
    })

    test("empty quote and book wrappers", async () => {
        render(<Home />);
        expect(screen.getByTestId("booksWrapper")).toBeEmptyDOMElement();
        expect(screen.getByTestId("quotesWrapper")).toBeEmptyDOMElement();
    })

    test("add button -> book modal is shown", async () => {
        render(<Home />);
        const user = userEvent.setup()
        const addButton = screen.getByRole("button", {name: "BOOK"});
        expect(addButton).toBeInTheDocument();
        await user.click(addButton)
        const bookModal = screen.getByText("ADD A NEW BOOK")
        expect(bookModal).toBeInTheDocument();
    })

    test("click on x -> close modal", async () => {
        render(<Home />);
        const user = userEvent.setup()
        const addButton = screen.getByRole("button", { name: "BOOK" });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton)
        const bookModal = screen.getByText("ADD A NEW BOOK")
        expect(bookModal).toBeInTheDocument();

        //get the close button and click on it
        const closeAddBookModalButton = screen.getByTestId("closeAddBookModal");
        expect(closeAddBookModalButton).toBeInTheDocument();
        await user.click(closeAddBookModalButton);
        const bookModal1 = screen.queryByText("ADD A NEW BOOK");
        expect(bookModal1).toBeNull();

    })

    /** tests the process for adding a book with a callback for continued testing
     * to maintain test state (so that the JSDom doesn't get cleared via cleanup() 
     * on the afterEach triggers)
     */
    const addBook = async () => {
        render(<Home />, { wrapper: Router });
        const user = userEvent.setup()
        const addButton = screen.getByRole("button", { name: "BOOK" });
        await user.click(addButton);
        const input = screen.getByPlaceholderText("Enter book name");
        const title = data.book1_title;

        //type in title
        await user.type(input, title);
        expect(input).toHaveValue(title);

        //submit new book
        const addBookButton = screen.getByText("ADD");
        expect(addBookButton).toBeInTheDocument();
        await user.click(addBookButton);

        return {screen, user}
    }

    test("add a book", async () => {
        const res = await addBook();
        const screen = res.screen;
        const user = res.user;

        //modal is closed
        const bookModal1 = screen.queryByText("ADD A NEW BOOK");
        expect(bookModal1).toBeNull();

        //new book is somewhere and in focus (colored darker)
        const title = data.book1_title;
        const newBook = screen.getByText(title);
        expect(newBook).toBeInTheDocument();
        expect(newBook).toHaveClass("bg-main-green text-white")

        //new book is in focus ==> "add quote" button is showing
        const addQuoteButton = screen.getByRole("link", { name: "QUOTE" });
        expect(addQuoteButton).toBeInTheDocument();
        expect(addQuoteButton).toHaveAttribute("href", `/app/${data.book1_id}`)
    })

    test("delete a book", async () => {
        const res = await addBook();
        const screen = res.screen;
        const user = res.user;

        //click the delete button; bring up the modal
        const deleteBookButton1 = screen.getByText("REMOVE BOOK");
        await user.click(deleteBookButton1);
        
        //delete book modal should be there -> yes/no buttons
        const confirmDeleteButton = screen.queryByText("YES");
        expect(confirmDeleteButton).toBeInTheDocument()
        if (!confirmDeleteButton){return;}
        const denyDeleteButton = screen.queryByText("NO");
        expect(denyDeleteButton).toBeInTheDocument()

        //confirm deletion -> close the modal
        await user.click(confirmDeleteButton);
        await waitFor(() => {
            const confirmDeleteButton1 = screen.queryByText("YES");
            expect(confirmDeleteButton1).toBeNull()
            const denyDeleteButton1 = screen.queryByText("NO");
            expect(denyDeleteButton1).toBeNull();
        })

        //book shouldn't be there anymore
        const title = data.book1_title;
        const oldBook = screen.queryByText(title)
        expect(oldBook).toBeNull();

        //no book is selected -> (no add quote/delete buttons)
        const addQuoteButton1 = screen.queryByText("QUOTE");
        expect(addQuoteButton1).toBeNull();
        const deleteBookButton2 = screen.queryByText("DELETE");
        expect(deleteBookButton2).toBeNull();
    })

    test("focuses/unfocuses book correctly", async () => {
        //26-30
        //check color of sidebar/text?, quote button? but that stays const
        const res = await addBook();
        const screen = res.screen;
        const user = res.user;

        //has the correct color when freshly added (in focus)
        const title = data.book1_title;
        const newBook = screen.getByText(title);
        expect(newBook).toBeInTheDocument();
        expect(newBook).toHaveClass("bg-main-green text-white")

        //unfocus and check that color changes
        await user.click(newBook);
        expect(newBook).toHaveClass("bg-white text-black")
    })

    test("closing delete book modal: click x OR click `no`", async () => {
        //198, 226
        const res = await addBook();
        const screen = res.screen;
        const user = res.user;
        
        await waitFor(async () => {
            //click the delete button; bring up the modal
            const deleteBookButton1 = screen.getByText("REMOVE BOOK");
            await user.click(deleteBookButton1);
    
            //delete book modal should be there -> yes/no buttons
            const confirmDeleteButton = screen.queryByText("YES");
            expect(confirmDeleteButton).toBeInTheDocument()
            if (!confirmDeleteButton) { return; }
            const denyDeleteButton = screen.queryByText("NO");
            expect(denyDeleteButton).toBeInTheDocument()
            if (!denyDeleteButton) { return; }
            
            //clicking on "no" closes the modal
            await user.click(denyDeleteButton);
            const denyDeleteButton1 = screen.queryByText("NO")
            expect(denyDeleteButton1).toBeNull();
        })
    })
})
