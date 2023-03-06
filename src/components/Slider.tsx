import "./slider.css"
import { useState } from "react";

function Slider({
    label,
    onChange
}:{
    label?:string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}){
    const min = -180
    const max = 180
    const [value, setValue] = useState(0)
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
        if (onChange){
            onChange(e)
        }
    }
    return (
        <div className="slidecontainer flex items-center justify-between">
            <label htmlFor={label} className="inline"> {label} </label>
            <input type="range" min={min.toString()} max={max.toString()} value={value.toString()} onChange={updateValue} className="slider" id={label}></input>
        </div>
    )
}

export {Slider}