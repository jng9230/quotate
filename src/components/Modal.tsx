
import { ReactElement } from "react"
import { CloseButton } from "./CloseButton"

function Modal({
    onClick,
    children,
}:{
    onClick: () => void,
    children: ReactElement,
}){
    const handleClick = () => {
        onClick()
        return
    }
    return (
        <div className="bg-black/[.60] 
            fixed 
            top-0 
            left-0 
            right-0 
            z-50 
            w-full 
            p-4 
            overflow-x-hidden 
            overflow-y-auto 
            h-full
            ">
            <div className="rounded-lg 
                w-full 
                max-w-2xl 
                h-auto 
                p-6 
                overflow-hidden 
                m-auto 
                bg-white relative">
                <CloseButton onClick={handleClick} styles="absolute right-1 top-1"></CloseButton>
                { children }
            </div>
        </div>
    )
}

export {Modal}