function Button({
    label,
    onClick,
    styles
}:{
    label: string,
    onClick: () => void,
    styles?: string
}){
    const allStyles = "rounded-md p-1 " + styles
    return (
        <button onClick={onClick} className={allStyles}> {label}</button>
    )
}

export {Button}