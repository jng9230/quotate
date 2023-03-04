import { TiDeleteOutline } from 'react-icons/ti';

function CloseButton({
    onClick,
    styles
}:{
    onClick: () => void,
    styles?: string 
}){
    const allStyles = "cursor-pointer hover:fill-red-600 " + styles
    return (
        <TiDeleteOutline className={allStyles}
            onClick={onClick}
        ></TiDeleteOutline>
    )
}

export {CloseButton}