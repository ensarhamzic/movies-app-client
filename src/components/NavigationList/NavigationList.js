import React from "react"
import NavigationItem from "../NavigationItem/NavigationItem"
import libraryIcon from "../../images/library.svg"
import addIcon from "../../images/add.svg"
import addCollectionIcon from "../../images/add-collection.svg"
import publishIcon from "../../images/publish.svg"
import dashboardIcon from "../../images/dashboard.svg"
import settingsIcon from "../../images/settings.svg"
import supportIcon from "../../images/support.svg"
import logoutIcon from "../../images/logout.svg"
import classes from "./NavigationList.module.css"

const NavigationList = () => {
  return (
    <div className={classes.list}>
      <NavigationItem icon={libraryIcon} alt="Library" title={"Library"} />
      <NavigationItem icon={addIcon} alt="Add Items" title={"Add Items"} />
      <NavigationItem
        icon={addCollectionIcon}
        alt="Add Collection"
        title={"Add Collection"}
      />
      <NavigationItem icon={publishIcon} alt="Publish" title={"Publish"} />
      <NavigationItem
        icon={dashboardIcon}
        alt="Dashboards"
        title={"Dashboards"}
      />
      <NavigationItem
        className={classes.separate}
        icon={settingsIcon}
        alt="Settings"
        title={"Settings"}
      />
      <NavigationItem icon={supportIcon} alt="Support" title={"Support"} />
      <NavigationItem icon={logoutIcon} alt="Logout" title={"Logout"} />
    </div>
  )
}

export default NavigationList
