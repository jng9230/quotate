const request = require("supertest");
require("dotenv").config({ path:"./config.env" });
const mongoose = require('mongoose');
//connect to DB
const PORT = process.env.PORT_TEST || 5001;
const URI = process.env.ATLAS_URI_TEST;
const user_id = "643dae8dac389bd6e3c99a45";
const app = require("../app")
// const db_name = "crud"
// const local_db_url = `mongodb://127.0.0.1/${db_name}`
async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
            // Safe to ignore. 
            if (error.message === 'ns not found') return

            // This error happens when you use it.todo.
            // Safe to ignore. 
            if (error.message.includes('a background operation is currently running')) return

            console.log(error.message)
        }
    }
}

beforeAll(async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {console.log("DB connected")})
        .catch(e => console.log(e))
});

describe('Test database CRUDs', () => {
    test("/test", async () => {
        const response = await request(app).get("/test");
        expect(response.statusCode).toBe(200);
    });

    test("correctly gets users on initial load", async () => {
        const res = await request(app).get("/user/")
        expect(Object.keys(res.body).length).toEqual(0)
    })

    let new_user;
    const name = "John Ng";
    const email = "asdf123@gmail.com";
    test("make a new user", async () => {
        const response = await request(app)
            .post("/user/")
            .send({name: name, email: email})
        expect(response.body.name).toEqual(name);
        expect(response.body.email).toEqual(email);
        new_user = response.body;
    });

    test("check that user was correctly added", async () => {
        const res = await request(app)
            .get("/user/by_email")
            .send({ email: new_user.email})
        expect(Object.keys(res.body).length).toEqual(1)
        expect(res.body[0].name).toEqual(name)
        expect(res.body[0].email).toEqual(email)
    })

    const title = "new book 22"
    let new_books = [];
    test("add a book", async () => {
        const res = await request(app)
            .post(`/book/book`)
            .send({
                title: title,
                user_id: new_user._id
            })
        expect(res.body.title).toEqual(title)
        expect(res.body.user).toEqual(new_user._id)
        new_books.push(res.body);
    });

    test("get books for user", async () => {
        const res = await request(app).get(`/book/book/all_for_user/${new_user._id}`);
        expect(res.statusCode).toBe(200);
        expect(Object.keys(res.body).length).toEqual(1);
        expect(res.body[0].title).toEqual(title)
    });

    test("add and get more than one book", async () => {
        const new_book = await request(app)
            .post(`/book/book`)
            .send({
                title: "wololololol",
                user_id: new_user._id
            })
        new_books.push(new_book.body)
        const res = await request(app).get(`/book/book/all_for_user/${new_user._id}`);
        expect(Object.keys(res.body).length).toEqual(2);
    });

    const text = "to be or not to be that is the question";
    test("add a quote", async () => {
        const book = new_books[0]._id;
        const res = await request(app)
            .post(`/quote/quote/`)
            .send({
                text: text,
                book: book,
                user_id: new_user._id
            })
        console.log(res.body);
        expect(res.body.text).toEqual(text);
        expect(res.body.book).toEqual(book);
        expect(res.body.user).toEqual(new_user._id);
    });

    // test("get quotes for book", async () => {
    //     const res = await request(app).get(`/quote/all_for_book/${new_books[0]._id}`);
    //     console.log(res.body);
    //     expect(Object.keys(res.body).length).toEqual(1);
    //     expect(res.body[0].text).toEqual(text);
    // });

    // test("get quotes for user", async () => {
    //     //add a quote for book 2
    //     const res = await request(app).get(`/book/book/all_for_user/${new_user._id}`);
    //     expect(res.statusCode).toBe(200);
    //     expect(Object.keys(res.body).length).toEqual(1);
    //     expect(res.body[0].title).toEqual(title)
    // });


})

afterAll(async () => {
    console.log("disconnecting")
    await dropAllCollections();
    await mongoose.connection.close();
});