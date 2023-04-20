// const request = require("supertest");
require("dotenv").config({ path:"./config.env" });
const mongoose = require('mongoose');
//connect to DB
const PORT = process.env.PORT_TEST || 5001;
const URI = process.env.ATLAS_URI_TEST;
const app = require("../app")
const chai = require('chai');
const chai_http = require('chai-http');
const { doesNotMatch } = require("assert");
const { connect } = require("http2");
const User = require("../models/user");
const Book = require("../models/book");
const Quote = require("../models/quote");
const { ServerDescriptionChangedEvent } = require("mongodb");

chai.use(chai_http);
const should = chai.should()
// const db_name = "crud"
// const local_db_url = `mongodb://127.0.0.1/${db_name}`
async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
            // await collection.deleteMany();
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

before(async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => { console.log("DB connected") })
        .catch(e => console.log(e))
});

describe('make and check users', () => {
    before(async () => {
        await dropAllCollections();
    });

    it("/test", (done) => {
        chai.request(app)
            .get("/test")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.result.should.be.eql("nice");
                done()
            })
    });

    it("correctly gets users on initial load", (done) => {
        chai.request(app)
            .get("/user/")
            .end((err, res) => {
                res.body.length.should.be.eql(0);
                done()
            })
    })

    it("makes a new user", (done) => {
        const name = "John Ng";
        const email = "asdf123@gmail.com";
        chai.request(app)
            .post("/user/")
            .send({name: name, email: email})
            .end((err, res) => {
                res.body.name.should.be.eql(name);
                res.body.email.should.be.eql(email);
                done()
            })
        // expect(response.body.name).toEqual(name);
        // expect(response.body.email).toEqual(email);
    });
})

describe("books", () => {
    let new_user;
    before(done => {
        dropAllCollections()
            .then(() => {
                console.log("adding a new user")
                const user = new User({ name: "Test Tester", email: "email2@gmail.com" })
                user.save().then((user) => {new_user = user; done();})
            })
    })

    beforeEach(done => {
        Book.deleteMany().then(() => {done()});
    })
    
    it("check that user has book", (done) => {
        const book = new Book({title: "test1", user: new_user._id})
        book.save()
            .then((book) => {
                chai.request(app)
                    .get(`/book/book/all_for_user/${new_user._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.length.should.be.eql(1);
                        res.body[0].title.should.be.eql(book.title);
                        done();
                    })
            })
    });

    it("add a book", (done) => {
        const title = "new book 22"
        chai.request(app)
            .post(`/book/book`)
            .send({
                title: title,
                user_id: new_user._id
            })
            .end((err, res) => {
                res.body.title.should.be.eql(title);
                res.body.user.should.be.eql(new_user._id.toString());
                done()
            })
    });

    it("delete a book", (done) => {
        const book = new Book({title: "to be delete", user: new_user._id})
        book.save()
            .then(book => {
                chai.request(app)
                    .delete("/book/book")
                    .send({id: book._id})
                    .end((err, res) => {
                        res.body.should.have.property("book")
                        res.body.should.have.property("quotes")
                        res.body.book.title.should.be.eql(book.title)
                        res.body.book._id.should.be.eql(book._id.toString())
                        res.body.quotes.deletedCount.should.be.eql(0)
                        done()
                    })
            })
    })
})

describe("quotes", () => {
    let new_user;
    let new_book;
    before(done => {
        // dropAllCollections()
        //     .then(() => {
        const user = new User({name:"adf waawa", email: "fake@gmail.com"})
        user.save()
            .then(user => {
                new_user = user;
                const book = new Book({title: "to be added to", user: user._id})
                book.save()
                    .then(book => {
                        new_book = book;
                        done();
                    })
            })
            // })

    })

    it("add a quote", (done) => {
        const text = "to be or not to be that is the q";
        chai.request(app)
            .post(`/quote/quote/`)
            .send({
                text: text,
                book: new_book._id,
                user_id: new_user._id
            })
            .end((err, res) => {
                res.body.text.should.be.eql(text);
                res.body.book.should.be.eql(new_book._id.toString());
                res.body.user.should.be.eql(new_user._id.toString());
                done();
            })
    })
})
    //     console.log(res.body);
    //     expect(res.body.text).toEqual(text);
    //     expect(res.body.book).toEqual(book);
    //     expect(res.body.user).toEqual(new_user._id);
    // });

    // it("get quotes for book", async () => {
    //     const res = await request(app).get(`/quote/all_for_book/${new_books[0]._id}`);
    //     console.log(res.body);
    //     expect(Object.keys(res.body).length).toEqual(1);
    //     expect(res.body[0].text).toEqual(text);
    // });

    // it("get quotes for user", async () => {
    //     //add a quote for book 2
    //     const res = await request(app).get(`/book/book/all_for_user/${new_user._id}`);
    //     expect(res.statusCode).toBe(200);
    //     expect(Object.keys(res.body).length).toEqual(1);
    //     expect(res.body[0].title).toEqual(title)
    // });


// let user;
// beforeEach(done => {
//     // Creating a new Instance of User Model
//     user = new User({ name: 'Shriyam', email: "bullshit@gmail.com"});
//     console.log(user)
//     user.save()
//         .then(() => {console.log("user finally in DB"); done()});
// });

// describe('Reading Details of User', () => {
//     it('Finds user with the name', (done) => {
//         console.log("user in DB?")
//         User.findOne({ name: 'Shriyam' })
//             .then((user) => {
//                 console.log("the fukc");
//                 user.name.should.be.eql("Shriyam")
//                 done();
//             });
//     })
// })

after(async() => {
    await dropAllCollections();
    await mongoose.connection.close();
})