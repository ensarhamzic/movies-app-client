import React from "react"
import classes from "./Button.module.css"

const Button = ({ className, content }) => {
  const buttonClasses = `${className} ${classes.button}`
  return <button className={buttonClasses}>{content}</button>
}

export default Button
