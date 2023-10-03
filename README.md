# Quotate
A React app that converts and stores book pages to text. 
- "notate" + "quote" === "quotate"
### Features, Screenshots
- login with Google, or as a guest.
![login](./imgs/login.png?raw=true "login")
- landing page, with books and quotes.
![landing](./imgs/landing.png?raw=true "landing")
- page to convert images
![convertPage](./imgs/convertPage.png?raw=true "convertPage")
- pre-binarization: note the purple tag on left.
![convPre](./imgs/convPre.png?raw=true "convPre")
- post-binarization: note the lack of purple.
![convPost](./imgs/convPost.png?raw=true "convPost")

### Motivation
I like to borrow books from the library, but keeping tabs on the most interesting lines
and pages is difficult when I have to return the books every three weeks. Introducing: an
app that solves this very specific issue.

I used the MERN stack for its wide popularity and ease of use.
- M: MongoDB, a NoSQL database that uses JSON-like documents to store its data. I used
Mongoose on top of this to allow for database schemas, leading to more control over 
data types.
- E: ExpressJS. Backend framework for REST APIs, along with PassportJS to handle
authentication with both Google and local email/password logins.
- R: React. Yep. With Tailwind CSS, because I've found with refactoring other projects
that my CSS tends towards a utility class kind of style, which is exactly what Tailwind
accomplishes.
- N: NodeJS. Server environment.

For converting images to text, I used TesseractJS, the JavaScript port of a popular OCR
engine. There are two major problems with photos of book pages though: 
1. Photos often aren't perfectly aligned.
2. I like to put semi-transparent tabs on notable lines. This unfortunately messes with
OCR, especially if I use a darker colored tab.
The first is solved with image rotation, and the second is solved with threshold filtering,
wherein a colorful image is converted into a black and white image based on individual 
pixel intensity.
