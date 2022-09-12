import React from "react"
import classes from "./Button.module.css"

const Button = ({ className, children, onClick, disabled = false }) => {
  const buttonClasses = `${classes.button} ${className}`
  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
