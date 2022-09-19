import React from "react"
import NavigationItem from "../NavigationItem/NavigationItem"
import libraryIcon from "../../images/library.svg"
import addIcon from "../../images/add.svg"
import favoritesIcon from "../../images/heart.png"
import addCollectionIcon from "../../images/add-collection.svg"
import publishIcon from "../../images/publish.svg"
import dashboardIcon from "../../images/dashboard.svg"
import settingsIcon from "../../images/settings.svg"
import supportIcon from "../../images/support.svg"
import logoutIcon from "../../images/logout.svg"
import classes from "./NavigationList.module.css"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/auth-slice"
import { useNavigate } from "react-router-dom"

const NavigationList = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutClickHandler = () => {
    dispatch(authActions.logout())
    navigate("/", { replace: true })
  }

  return (
    <div className={`${classes.list} ${className || ""}`}>
      <NavigationItem
        icon={libraryIcon}
        alt="Library"
        title={"Library"}
        location="/library"
      />
      <NavigationItem
        icon={favoritesIcon}
        alt="Favorites"
        title={"Favorites"}
        location="/favorites"
      />
      <NavigationItem
        icon={addIcon}
        alt="Add Items"
        title={"Add Items"}
        location="/add-items"
      />
      <NavigationItem
        icon={addCollectionIcon}
        alt="Add Collection"
        title={"Add Collection"}
        location="/add-collection"
      />
      <NavigationItem
        icon={publishIcon}
        alt="Publish"
        title={"Publish"}
        location="/publish"
      />
      <NavigationItem
        icon={dashboardIcon}
        alt="Dashboards"
        title={"Dashboards"}
        location="/dashboards"
      />
      <NavigationItem
        className={classes.separate}
        icon={settingsIcon}
        alt="Settings"
        title={"Settings"}
        location="/settings"
      />
      <NavigationItem
        icon={supportIcon}
        alt="Support"
        title={"Support"}
        location="/support"
      />
      <NavigationItem
        icon={logoutIcon}
        alt="Logout"
        title={"Logout"}
        button={true}
        onClick={logoutClickHandler}
      />
    </div>
  )
}

export default NavigationList
