import React from "react"
import { NavLink } from "react-router-dom"
import classes from "./NavigationItem.module.css"

const NavigationItem = ({ location, title, icon, alt, className }) => {
  const wrapperClasses = `${classes.wrapper} ${className || ""}`
  return (
    <NavLink
      to={location}
      className={(nav) =>
        `${classes.link} ${nav.isActive ? classes.active : ""}`
      }
    >
      <div className={wrapperClasses}>
        <div className={classes.item}>
          <img className={classes.img} src={icon} alt={alt} />
          <p className={classes.title}>{title}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default NavigationItem
