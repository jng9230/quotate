// import { TiDeleteOutline } from 'react-icons/ti';
import { BiX } from 'react-icons/bi'

function CloseButton({
    onClick,
    styles
}:{
    onClick: () => void,
    styles?: string 
}){
    const allStyles = "cursor-pointer hover:fill-red-600 " + styles
    return (
        <BiX className={allStyles}
            onClick={onClick}
        ></BiX>
    )
}

export {CloseButton}