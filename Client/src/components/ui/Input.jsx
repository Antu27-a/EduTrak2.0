"use client"

import "../Css/Input.css"

export default function Input({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    name,
    required = false,
}) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <div className="input-wrapper">
                {Icon && <Icon size={20} />}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        </div>
    )
}
