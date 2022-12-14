import React, { useEffect, useState } from "react"
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"
import Button from "../Button/Button"
import Logo from "../Logo/Logo"
import NavigationList from "../NavigationList/NavigationList"
import ProfileButton from "../ProfileButton/ProfileButton"
import SocialBar from "../SocialBar/SocialBar"
import classes from "./Navigation.module.css"

const Navigation = () => {
  const [opened, setOpened] = useState(false)
  const [mobileView, setMobileView] = useState(false)

  useEffect(() => {
    if (window.innerWidth <= 1024) setMobileView(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setMobileView(true)
      } else {
        setMobileView(false)
        setOpened(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const linkClickHandler = () => {
    if (mobileView) setOpened(false)
  }
  return (
    <div className={`${classes.nav} ${opened && classes.navOpened}`}>
      <div className={classes.header}>
        <Logo className={classes.logo} />
        {mobileView && (
          <div
            className={classes.burgerMenu}
            onClick={() => {
              setOpened((prevState) => !prevState)
            }}
          >
            {!opened && <AiOutlineMenu />}
            {opened && <AiOutlineClose />}
          </div>
        )}
      </div>
      {(!mobileView || (mobileView && opened)) && (
        <>
          <NavigationList
            className={classes.navigationList}
            onLinkClick={linkClickHandler}
          />
          {mobileView && opened && (
            <ProfileButton mobile={true} onClick={linkClickHandler} />
          )}
          <Button className={classes.upgradeBtn}>Upgrade</Button>
          <SocialBar />
        </>
      )}
    </div>
  )
}

export default Navigation
