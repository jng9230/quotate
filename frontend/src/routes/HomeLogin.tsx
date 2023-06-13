import { Home } from "./Home"
import { useEffect, useState } from "react";
import { userReturnType } from "../utils/APIReturnTypes";
import { getAuthedUser } from "../utils/apiCalls";
import { useNavigate } from "react-router-dom";
import { HomeHeader } from "../components/HomeHeader";
function HomeLogin(){
    // const [user, setUser] = useState<userReturnType>();
    // const authed = user !== undefined;
    //auth status changes -> reset user based on auth token
    useEffect(() => {
        // if (token === undefined || token === null){console.error("NO TOKEN PROVIDED");return;}
        getAuthedUser()
            .then(res => {
                // setUser(res);
                const res1 = res as userReturnType
                // <Navigate to="/home" />
                // const nav = useNavigate()
                // nav('/home', {replace: true, state: {user: res1}})
            })
            .catch(err => console.error(err))
    }, [])

    // const handleLogin = () => {
    //     // console.log(process.env.API_BASE)
    //     window.open(API_BASE + "/auth/google", "_self");
    // }
    return (
        <>
            {/* <div>log tf in bro</div>
            <HomeHeader setAddBookModal={() => {}} authed={false} basic_button_classes=""></HomeHeader> */}
        </>
    )
}

export {HomeLogin}