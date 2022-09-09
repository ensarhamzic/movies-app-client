import React from "react"
import classes from "./Button.module.css"

const Button = ({ className, content, onClick }) => {
  const buttonClasses = `${classes.button} ${className}`
  return (
    <button className={buttonClasses} onClick={onClick}>
      {content}
    </button>
  )
}

export default Button
