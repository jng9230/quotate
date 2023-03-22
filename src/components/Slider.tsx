import "./slider.css"
import { useState } from "react";
import { ReactElement } from "react"

function Slider({
    label,
    onChange,
    min=-180,
    max=180,
    step="any",
    list,
    children,
    onBlur
}:{
    label?:string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    min?:number,
    max?:number,
    step?:number | string,
    list?: string,
    children?: ReactElement,
    onBlur?: () => void
}){
    const [value, setValue] = useState(0)
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
        if (onChange){
            onChange(e)
        }
    }
    return (
        <div className="slidecontainer flex items-center justify-between relative">
            <label htmlFor={label} className="inline"> {label} </label>
            <input 
                type="range" 
                min={min.toString()} 
                max={max.toString()} 
                value={value.toString()} 
                onChange={updateValue} 
                className="slider" 
                step={step}
                id={label}
                list={list}
                onBlur={onBlur}
            />
            {children}
        </div>
    )
}

export {Slider}