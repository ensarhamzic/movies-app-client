import React from "react"
import { NavLink } from "react-router-dom"
import classes from "./NavigationItem.module.css"

const NavigationItem = ({
  location,
  title,
  icon,
  alt,
  className,
  button,
  onClick,
  onLinkClick,
}) => {
  if (!button)
    return (
      <NavLink
        to={location}
        className={(nav) =>
          `${classes.link} ${nav.isActive ? classes.active : ""} ${className}`
        }
        onClick={onLinkClick}
      >
        <div className={classes.wrapper}>
          <div className={classes.item}>
            <img className={classes.img} src={icon} alt={alt} />
            <p className={classes.title}>{title}</p>
          </div>
        </div>
      </NavLink>
    )

  return (
    <div className={classes.wrapper} onClick={onClick}>
      <div className={classes.item}>
        <img className={classes.img} src={icon} alt={alt} />
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  )
}

export default NavigationItem
