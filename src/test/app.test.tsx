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
import 'jsdom-worker'
import { executionAsyncResource } from 'async_hooks';

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
                    <Route path='app/:id' element={<App />}></Route>
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
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        
        const input:HTMLInputElement = screen.getByLabelText("Upload file(s)");
        expect(input).toBeInTheDocument();
        if (!input || !input.files){return;}
        const file = new File(['image'], 'image.png', { type: 'image/png' });
        await userEvent.upload(input, file)

        expect(input.files[0]).toStrictEqual(file)
        expect(input.files).toHaveLength(1)

        //carousel reflects changes
        // const carousel = screen.getByTestId("carousel");
        const carouselImg: HTMLImageElement = screen.getByAltText("carouselImage-0");
        expect(carouselImg).toBeInTheDocument();
        const focusedImg: HTMLImageElement = screen.getByAltText("uploadedImage");
        expect(focusedImg).toBeInTheDocument();
        expect(carouselImg.src).toEqual(focusedImg.src);
        
        await waitFor(() => {})
    })

    test("uploading multiple images and changing focused image", async () => {
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()

        const input: HTMLInputElement = screen.getByLabelText("Upload file(s)");
        expect(input).toBeInTheDocument();
        if (!input || !input.files) { return; }
        const file0 = new File(['image0'], 'image0.png', { type: 'image/png' });
        const file1 = new File(['image1'], 'image1.png', { type: 'image/png' });
        await userEvent.upload(input, [file0, file1])

        expect(input.files[0]).toStrictEqual(file0)
        expect(input.files[1]).toStrictEqual(file1)
        expect(input.files).toHaveLength(2)

        //carousel reflects changes
        const carouselImg0: HTMLImageElement = screen.getByAltText("carouselImage-0");
        expect(carouselImg0).toBeInTheDocument();
        const carouselImg1: HTMLImageElement = screen.getByAltText("carouselImage-0");
        expect(carouselImg1).toBeInTheDocument();
        const focusedImg: HTMLImageElement = screen.getByAltText("uploadedImage");
        expect(focusedImg).toBeInTheDocument();
        expect(carouselImg0.src).toEqual(focusedImg.src);

        //click -> change focused image 
        await user.click(carouselImg1);
        expect(carouselImg1.src).toEqual(focusedImg.src);
    })

    test("running OCR", async () => {
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()

        const input: HTMLInputElement = screen.getByLabelText("Upload file(s)");
        expect(input).toBeInTheDocument();
        if (!input || !input.files) { return; }
        const file = new File(['image'], 'image.png', { type: 'image/png' });
        await userEvent.upload(input, file)

        const editButton = screen.getByText("Edit");
        await user.click(editButton);

        //preprocessing modal shows correctly
        const preprocessingModal = screen.getByTestId("preprocessingModal");
        expect(preprocessingModal).toBeInTheDocument();

        const buttonsToCheck = [
            "Rotation",
            "B/W Threshold",
            "Confirm"
        ]
        buttonsToCheck.map((name) => {
            const btn = screen.getByText(name);
            expect(btn).toBeInTheDocument();
        })

        // await user.click(screen.getByText("Confirm"));

        // const textArea:HTMLTextAreaElement = screen.getByTestId("textArea");
        // console.log(textArea.value)
        await waitFor(() => {})
    })

    test("adding a quote", async () => {
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()
        
        //clicking button; seeing change in storage box
        const textArea: HTMLTextAreaElement = screen.getByTestId("textArea");
        await user.type(textArea, data.quote1_text);
        expect(textArea).toHaveValue(data.quote1_text);

        const addQuoteButton = screen.getByText("Save");
        await user.click(addQuoteButton);
        const newQuote = screen.getByTestId(`storedQuote-${data.quote1_id}`)
        expect(newQuote).toBeInTheDocument();
        expect(within(newQuote).getByText(data.quote1_text)).toBeInTheDocument();
    })

    test("deleting a quote", async () => {
        //clicking button; seeing change in storage box

        //add a quote first 
        render(
            <MemoryRouter initialEntries={[`/app/${data.book1_id}`]}>
                <Routes>
                    <Route path='app/:id' element={<App />}></Route>
                </Routes>
            </MemoryRouter>
        )
        const user = userEvent.setup()

        const textArea: HTMLTextAreaElement = screen.getByTestId("textArea");
        await user.type(textArea, data.quote1_text);
        const addQuoteButton = screen.getByText("Save");
        await user.click(addQuoteButton);
        const newQuote = screen.getByTestId(`storedQuote-${data.quote1_id}`)

        //click delete button
        const delQuoteButton = screen.getByTestId(`deleteQuote-${data.quote1_id}`);
        expect(delQuoteButton).toBeInTheDocument();
        await user.click(delQuoteButton);
        const newQuote1 = screen.queryByTestId(`storedQuote-${data.quote1_id}`)
        expect(newQuote1).toBeNull();
    })
})