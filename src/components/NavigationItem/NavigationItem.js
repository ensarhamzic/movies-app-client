import React from "react"
import classes from "./NavigationItem.module.css"

const NavigationItem = ({ title, icon, alt, className }) => {
  const wrapperClasses = `${className} ${classes.wrapper}`
  return (
    <div className={wrapperClasses}>
      <div className={classes.item}>
        <img className={classes.img} src={icon} alt={alt} />
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  )
}

export default NavigationItem
