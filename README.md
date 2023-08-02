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
### Final Thoughts
- University taught me a thing or two about testing, but it's one thing to write tests for an algorithm
that you know will work because it's a very isolated, 20 or so line piece of code, and it's another
thing to write an end-to-end test spanning 100s of lines and multiple files. The use of React
Testing Library and mocking API calls (which I knew worked because of the unit tests on the backend)
gave me a sense of security and confidence in the code that I've never quite felt before.

- Testing is one thing. Usage is another. Despite all the testing for this API call or that
button, there are still missed edge cases. I had a friend mess around with the site, and 
he just put in a 100 character long word that messed with the boundaries of the page. Definitely
something to test for in hindsight, and yet another reason for separating the code from the
tester.

- Deployment is yet another beast. The app worked great locally, but with deployment onto
a service like Google Cloud Run and using the bare minimum specs for the server, there is bare 
minimum performance. The app would be very slow on startup because of a "cold start", a problem
that occurs because Cloud Run brings down containers after they haven't been used for a bit. Increasing
the minimum number of containers running from 0 to 1 solves this problem, but then it starts
hitting the wallet! New areas, new problems.

- There's quite a lot of things that I'd like to have done to turn this into something
that I'd use on a more consistent basis. The most major one being that
I should've made this a mobile app. Granted, I have 0 clue how to code mobile apps, so that's
for the future. React Native? With Expo?
