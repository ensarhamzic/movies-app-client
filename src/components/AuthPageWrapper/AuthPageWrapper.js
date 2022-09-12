import React from "react"
import classes from "./AuthPageWrapper.module.css"

const AuthPageWrapper = ({ children, className }) => {
  return (
    <div className={`${classes.wrapper} ${className || ""}`}>{children}</div>
  )
}

export default AuthPageWrapper
