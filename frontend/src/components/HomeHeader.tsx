import { BiPlus } from "react-icons/bi"
import { config } from "../utils/config"
const API_BASE = config.API_BASE;

function HomeHeader({
    setAddBookModal,
    authed,
}: {
    setAddBookModal: (val:boolean) => void, 
    authed: boolean,
}){
    const basic_button_classes = `
        btn-std 
        border-std 
        border-main-green 
        text-main-green 
        bg-white 
    `
    const handleLogin = () => {
        // console.log(process.env.API_BASE)
        window.open(API_BASE + "/auth/google", "_self");
    }
    const handleLogout = () => {
        window.open(API_BASE + "/auth/logout", "_self");
    }
    return (
        <header className="grid grid-cols-3 gap-3 p-3">
            <div className="">
                <button className="btn-std 
                            border-main-green 
                            border-std 
                            bg-white
                            text-main-green
                            flex
                            items-center
                            transition 
                            ease-out
                            hover:scale-105
                        "
                    onClick={() => { setAddBookModal(true) }}
                >
                    <BiPlus className="mr-2" />
                    BOOK
                </button>
            </div>
            <div className="col-start-2 col-span-full flex w-full justify-between">
                {/* <div className="bg-black border-black border-std w-4/5"></div> */}
                <div></div>
                {
                    !authed ? <button onClick={handleLogin} className={basic_button_classes}> LOGIN </button>
                        : <button onClick={handleLogout} className={basic_button_classes}> LOGOUT </button>
                }
            </div>
        </header>
    )
}

export {HomeHeader}