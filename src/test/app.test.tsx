import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from "../routes/App"
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');
import { within, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event';
import { server } from './mockServer.js'
import * as API from "../utils/APIReturnTypes";
import * as data from "./mockData";
import { BrowserRouter as Router, Routes, Route, MemoryRouter } from 'react-router-dom'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers(); //reset handlers to ensure test isolation
    cleanup(); //reset JSDom
})
afterAll(() => server.close())

describe("app", () => {
    test("initial render", async () => {
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App/>}></Route>
                </Routes>
            </MemoryRouter>
        )

        //check if right book is rendered via the title 
        await waitFor(() => {
            expect(screen.getByText(data.book1_title)).toBeInTheDocument();
        })
        // const bookTitle = screen.queryByText(data.book1_title);
        // expect(bookTitle).toBeInTheDocument();

        //check buttons
        const buttonsToCheck = [
            "Save",
            "Upload file(s)",
            "Edit"
        ]
        buttonsToCheck.forEach((name) => {
            expect(screen.queryByText(name)).toBeInTheDocument();
        })

        //check that the back button is an actual link
        const backButton = screen.getByRole("link", { name: "Back" });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute("href", `/`)

        await waitFor(() => {})
    })

    test("uploading an image", async () => {
        //carousel changes
    })

    test("running OCR", async () => {
        //modals, buttons, quote gets added
    })

    test("adding a quote", async () => {
        //clicking button; seeing change in storage box
    })

    test("deleting a quote", async () => {
        //clicking button; seeing change in storage box
    })
})