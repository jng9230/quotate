import { config } from "../utils/config";
// import { AiOutlineArrowRight } from "react-icons/ai";
import { BiBook, BiImages } from "react-icons/bi";
import { BsTextLeft } from "react-icons/bs"
import { FiArrowRight } from "react-icons/fi"
// const logo = require("../img/logo.png")
// const bookImg = require("../img/person-reading.png")


const API_BASE = config.API_BASE;
function Login(){
    const handleGoogleLogin = () => {
        window.open(API_BASE + "/auth/google", "_self");
    }
    const handleGuestLogin = () => {
        window.open(API_BASE + "/auth/guest", "_self");
    }
    const size = 100;
    return (
        <>
            <div className="
                w-screen 
                h-screen 
                flex 
                items-center
                justify-evenly 
                bg-gradient-to-r 
                from-secondary-green
                to-white
            ">
                <div className="
                            flex
                            flex-col
                            items-center
                            p-6
                            space-y-6
                            bg-white
                            border-std
                            border-black
                        ">
                    <div className="flex">
                        {/* <img src={logo} alt="logo"  className="max-h-10 mr-1"/> */}
                        <h1 className="text-3xl"> Quotate </h1>
                    </div>
                    <button onClick={handleGuestLogin}
                        className="btn-std border-std border-main-green text-main-green">
                        Continue as guest
                    </button>
                    <button onClick={handleGoogleLogin}
                        className="btn-std border-std border-main-green text-main-green">
                        Login with Google
                    </button>

                </div>
                <div className="flex space-x-5">
                    <BiBook size={size} />
                    <FiArrowRight size={size} />
                    <BiImages size={size} />
                    <FiArrowRight size={size} />
                    <BsTextLeft size={size} />
                </div>
            </div>
        </>
    )
}
export {Login}