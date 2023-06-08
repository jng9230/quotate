/**
 * For testing the home page when there are non-zero quotes/books 
 * (need a different server to handle that)
 */
import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '../routes/Home';
import '@testing-library/jest-dom';
import { within, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event';
import { server, serverNon0 } from './mockServer'
import * as data from "./mockData";
import { BrowserRouter as Router, Routes, Route, MemoryRouter } from 'react-router-dom'

beforeAll(() => {
    server.close();
    serverNon0.listen()
})
afterEach(() => {
    serverNon0.resetHandlers(); //reset handlers to ensure test isolation
    cleanup(); //reset JSDom
})
afterAll(() => serverNon0.close())

describe("home w/ non-zero initial books & quotes", () => {
    test("renders non-zero books if there were books previously", async () => {
        //110
        //separate server?   
        render(<Home />, { wrapper: Router });

        await waitFor(() => {
            const book1 = data.book1;
            const bookOnScreen = screen.getByText(book1.title)
            expect(bookOnScreen).toBeInTheDocument()
        })
    })

    test("renders quotes for selected book, given that the quote was already added", async () => {
        //47
        //separate server? 
        render(<Home />, { wrapper: Router });

        await waitFor(async () => { 
            const book1 = data.book1;
            const bookOnScreen = screen.getByText(book1.title)
            const user = userEvent.setup()
            await user.click(bookOnScreen);
    
            const quote1 = data.quote1;
            expect(screen.getByText(quote1.text)).toBeInTheDocument();
        })
    })
    
    // test("adding book doesn't do anthing if user isn't loggined in", () => {
    //     //63
    // })
})