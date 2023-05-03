// import { TiDeleteOutline } from 'react-icons/ti';
import { BiX } from 'react-icons/bi'

function CloseButton({
    onClick,
    styles,
    testID
}:{
    onClick: () => void,
    styles?: string 
    testID?: string
}){
    const allStyles = "cursor-pointer hover:fill-red-600 " + styles
    return (
        <BiX className={allStyles}
            onClick={onClick}
            data-testid={testID}
        ></BiX>
    )
}

export {CloseButton}