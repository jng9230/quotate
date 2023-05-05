
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import {Home} from './Home';

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