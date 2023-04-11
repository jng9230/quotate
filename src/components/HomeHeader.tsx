import { BiPlus } from "react-icons/bi"
function HomeHeader({
    setAddBookModal,
    authed,
    // handleLogin,
    // handleLogout,
    basic_button_classes,
    API_BASE
}: {
    setAddBookModal: (val:boolean) => void, 
    authed: boolean,
    // handleLogin: () => void,
    // handleLogout: () => void,
    basic_button_classes: string,
    API_BASE: string
}){
    const handleLogin = () => {
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
                <div className="bg-black border-black border-std w-4/5"></div>
                {
                    !authed ? <button onClick={handleLogin} className={basic_button_classes}> Login</button>
                        : <button onClick={handleLogout} className={basic_button_classes}> Logout </button>
                }
            </div>
        </header>
    )
}

export {HomeHeader}