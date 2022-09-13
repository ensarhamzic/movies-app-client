import React from "react"
import classes from "./Select.module.css"

const Select = ({ className, options, value, onChange, placeholder }) => {
  return (
    <div className={`${classes.wrapper} ${className || ""}`}>
      <select value={value} onChange={onChange}>
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
