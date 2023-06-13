const config = require("./config")
const PORT = config.PORT || 5000;
const app = require("./app");
const mongoose = require('mongoose');
const URI = config.ATLAS_URI;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(console.error)
    .finally(async () => {
    }
);