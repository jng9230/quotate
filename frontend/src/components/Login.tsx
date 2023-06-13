import { config } from "../utils/config"
const API_BASE = config.API_BASE;
function Login(){
    const handleGoogleLogin = () => {
        window.open(API_BASE + "/auth/google", "_self");
    }
    const handleGuestLogin = () => {
        window.open(API_BASE + "/login/guest", "_self");
    }
    return (
        <>
            <div className="h-screen w-screen bg-gray-600 flex items-center justify-center">
                <div className="
                    border-std 
                    border-black
                    bg-white 
                    flex
                    flex-col
                    items-center
                    p-3
                    space-y-3
                ">
                    <button onClick={handleGuestLogin}
                        className="btn-std border-std border-main-green text-main-green">
                        Continue as guest
                    </button>
                    <button onClick={handleGoogleLogin}
                        className="btn-std border-std border-main-green text-main-green"> 
                        Login with Google 
                    </button>
                </div>
            </div>
        </>
    )
}
export {Login}