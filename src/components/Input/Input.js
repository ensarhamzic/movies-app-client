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
  onFocus,
  onBlur,
  disabled = false,
}) => {
  const [blurred, setBlurred] = useState(false)
  const blurHandler = () => {
    setBlurred(true)
    onBlur && onBlur()
  }
  const focusHandler = () => {
    setBlurred(false)
    onFocus && onFocus()
  }

  const wrapperClasses = `${classes.wrapper} ${
    error && (blurred || submitted) && classes.error
  } ${className || ""}`
  return (
    <input
      className={wrapperClasses}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={focusHandler}
      onBlur={blurHandler}
      disabled={disabled}
    />
  )
}

export default Input
