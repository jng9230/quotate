
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import {Home} from './Home';
import { HomeLogin } from './HomeLogin';

function LandingPage(){
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/app/:id' element={<App />} />
            </Routes>
        </Router>
    )
}

export {LandingPage}