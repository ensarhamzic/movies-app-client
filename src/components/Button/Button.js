import React from "react"
import classes from "./Button.module.css"

const Button = ({ className, content, onClick, disabled = false }) => {
  const buttonClasses = `${classes.button} ${className}`
  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}

export default Button
