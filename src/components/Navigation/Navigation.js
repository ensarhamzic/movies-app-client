import React from "react"
import Button from "../Button/Button"
import Logo from "../Logo/Logo"
import NavigationList from "../NavigationList/NavigationList"
import SocialBar from "../SocialBar/SocialBar"
import classes from "./Navigation.module.css"

const Navigation = () => {
  return (
    <div className={classes.nav}>
      <Logo className={classes.logo} />
      <NavigationList />
      <Button className={classes.upgradeBtn}>Upgrade</Button>
      <SocialBar />
    </div>
  )
}

export default Navigation
