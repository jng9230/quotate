import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import App from "../routes/App"
import '@testing-library/jest-dom';
import { within, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event';
import { server } from './mockServer'
import * as data from "./mockData";
import { BrowserRouter as Router, Routes, Route, MemoryRouter } from 'react-router-dom'
import 'jsdom-worker'
import { act } from 'react-dom/test-utils';
import * as canvasUtils from "../utils/canvasUtils"
import * as preprocess from "../utils/preprocess"
import * as OCR from "../utils/OCR"
import { config } from "../config"
// import * as Tesseract from 'tesseract.js';
// const tesseract = jest.createMockFromModule("../node_modules/tesseract.js");

// getCroppedImg = jest.fn();

// jest.mock('../utils/canvasUtils', () => ({
//     getCroppedImg: jest.fn(),
// }));

beforeAll(() => { 
    server.listen(); 
})
beforeEach(() => { 
    cleanup(); 
    jest.resetModules();
})
afterEach(() => {
    server.resetHandlers(); //reset handlers to ensure test isolation
    cleanup(); //reset JSDom
})
afterAll(() => {
    server.close()
})

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

    const bringUpEditModal = async () => {
        //copied from "run ocr" test -- upload file and bring up the modal
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

        return {screen, user}
    }
    test("running OCR", async () => {
        const res = await bringUpEditModal();
        if (!res){console.error("res undefined"); return;}
        const screen = res.screen;
        const user = res.user;

        //mock getCroppedImg and preprocessImgFromURL to both return a URL
        //-- mock b/c it's copy pasted code -- no real need to test 
        const file0 = new File(['image0'], 'image0.png', { type: 'image/png' });
        const file1 = new File(['image1'], 'image1.png', { type: 'image/png' });
        const newURL0 = URL.createObjectURL(file0)
        const newURL1 = URL.createObjectURL(file1)
        const getCroppedImgSpy = jest.spyOn(canvasUtils, "getCroppedImg")
        getCroppedImgSpy.mockResolvedValue(newURL0)

        const prepSpy = jest.spyOn(preprocess, "preprocessImageFromURL2")
        prepSpy.mockResolvedValue(newURL1)

        //have to mock tesseract over b/c JSDom doesn't support web workers
        const ocrFn = jest.spyOn(OCR, "OCR");
        const mockOCRVal = "wowowowwoowowowe";
        ocrFn.mockResolvedValue(mockOCRVal);

        //make sure that the image path gets set to the new URL 
        await user.click(screen.getByText("Confirm"));
        
        //modal closed, preprocessing fxns are called, image paths updated
        expect(screen.queryByTestId("preprocessingModal")).toBeNull();
        expect(getCroppedImgSpy).toHaveBeenCalledTimes(1);
        expect(prepSpy).toHaveBeenCalledTimes(1);
        
        //make sure that OCR runs 
        await waitFor(async () => {
            const focusedImg: HTMLImageElement = screen.getByAltText("uploadedImage");
            expect(focusedImg).toBeInTheDocument();
            expect(focusedImg.src).toEqual(newURL1);
        })
        await waitFor(() => {
            const textArea:HTMLTextAreaElement = screen.getByTestId("textArea");
            expect(textArea.value).toEqual(mockOCRVal);
        })
    })

    test("adjusting bin threshold", async () => {
        const res = await bringUpEditModal();
        if (!res) { console.error("res undefined"); return; }
        const screen = res.screen;
        const user = res.user;

        //setup done; get slider butifton
        const thresholdSlider:HTMLInputElement = screen.getByTestId("slider-threshold");
        expect(thresholdSlider).toBeInTheDocument();

        const file0 = new File(['image0'], 'image0.png', { type: 'image/png' });
        const file1 = new File(['image1'], 'image1.png', { type: 'image/png' });
        const newURL0 = URL.createObjectURL(file0)
        const newURL1 = URL.createObjectURL(file1)
        const cropFxn = jest.spyOn(canvasUtils, "getCroppedImg")
        cropFxn.mockResolvedValue(newURL0)
        const prepSpy = jest.spyOn(preprocess, "preprocessImageFromURL2")
        prepSpy.mockResolvedValue(newURL1)

        await act(async () => {
            //move once and sit -- make sure update funtion is called
            fireEvent.change(thresholdSlider, { target: { value: 10 } });
            expect(thresholdSlider.value).toBe("10")
            // const cropFxn = jest.spyOn(canvasUtils, "getCroppedImg")
            expect(cropFxn).toHaveBeenCalledTimes(0);
            await new Promise((r) => setTimeout(r, 550)); //timeout in app is 500
            expect(cropFxn).toHaveBeenCalledTimes(1);
            
            //move a bunch before settling -- make sure update is only called once
            const max = config.preprocess.THRESHOLD_MAX;
            const min = config.preprocess.THRESHOLD_MIN;
            const vals = [0, 10, 20, 15, 5, 10, 15, max - 1, min + 1];
            vals.forEach((v) => {
                fireEvent.change(thresholdSlider, { target: { value: v } });
            })
            expect(cropFxn).toHaveBeenCalledTimes(1);//called once from first test
            await new Promise((r) => setTimeout(r, 550));
            expect(cropFxn).toHaveBeenCalledTimes(2);//called again
            
            //vals get edited if they're too large/small
            fireEvent.change(thresholdSlider, { target: { value: max } });
            await new Promise((r) => setTimeout(r, 550));
            expect(prepSpy).toHaveBeenCalledWith(newURL0, 1);
            fireEvent.change(thresholdSlider, { target: { value: min } });
            await new Promise((r) => setTimeout(r, 550));
            expect(prepSpy).toHaveBeenCalledWith(newURL0, -1);
        })
    })

    test("adjusting rotation", async () => {
        //normal path to upload and start to convert an image
        const res = await bringUpEditModal();
        if (!res) { console.error("res undefined"); return; }
        const screen = res.screen;
        const user = res.user;

        //setup done; get slider butifton
        const rotationSlider: HTMLInputElement = screen.getByTestId("slider-rotation");
        expect(rotationSlider).toBeInTheDocument();

        //slider works
        const vals = [0, -10, 20, 15, -50, 10, 15, 180, -175, -180];
        vals.forEach(v => {
            fireEvent.change(rotationSlider, { target: { value: v } });
            expect(rotationSlider.value).toBe(v.toString())
        })
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
        await waitFor(() => {
            const newQuote = screen.getByTestId(`storedQuote-${data.quote1_id}`)
            expect(newQuote).toBeInTheDocument();
            expect(within(newQuote).getByText(data.quote1_text)).toBeInTheDocument();
        })
    })

    test("deleting a quote", async () => {
        //clicking button; seeing change in storage box

        //add a quote first (copied from "adding a quote" test)
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

        //click delete button
        await waitFor(async () => {
            const delQuoteButton = screen.getByTestId(`deleteQuote-${data.quote1_id}`);
            expect(delQuoteButton).toBeInTheDocument();
            await user.click(delQuoteButton);
            const newQuote1 = screen.queryByTestId(`storedQuote-${data.quote1_id}`)
            expect(newQuote1).toBeNull();
        })
    })
})