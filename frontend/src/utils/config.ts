if (process.env.ENVIRONMENT !== 'production') {
    // require('dotenv').config({ path: ".env" })
}

// console.log(process.env.API_BASE);
// console.log(process.env.NODE_ENV);
// console.log(process.env.REACT_APP_VAR);
const config = {
    preprocess:{
        THRESHOLD_MIN: 0,
        THRESHOLD_MAX: 20
    },
    API_BASE: process.env.REACT_APP_API_BASE || "http://localhost:5000",
    // API_BASE : 'https://june-iiugnbm54q-uc.a.run.app',
    API_BASE_TEST: "http://localhost",
};

export {config}