import React, { useState } from "react"
import classes from "./Input.module.css"

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  submitted,
  className,
}) => {
  const [blurred, setBlurred] = useState(false)
  const blurHandler = () => {
    setBlurred(true)
  }
  const focusHandler = () => {
    setBlurred(false)
  }

  const wrapperClasses = `${classes.wrapper} ${
    error && (blurred || submitted) && classes.error
  } ${className || ""}`
  return (
    <div className={wrapperClasses}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
    </div>
  )
}

export default Input
