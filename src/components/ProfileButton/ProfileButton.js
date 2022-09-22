import React, { useState, useEffect } from "react"
import classes from "./ProfileButton.module.css"
import profilePicture from "../../images/profilePicture.png"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import useOutsideClickEvent from "../../hooks/use-outside-click-event"
import { useRef } from "react"
import { RiArrowRightSLine } from "react-icons/ri"

const ProfileButton = ({ className, mobile, onClick }) => {
  const user = useSelector((state) => state.auth.user)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const wrapperRef = useRef(null)
  useOutsideClickEvent(wrapperRef, () => {
    if (detailsVisible) {
      setDetailsVisible(false)
    }
  })

  const imageClick = () => {
    setDetailsVisible(false)
  }

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
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (!mobile && !mobileView)
    return (
      <div
        className={`${classes.wrapper} ${
          detailsVisible && classes.wrapperDetails
        } ${className && className}`}
        onClick={() => {
          !detailsVisible && setDetailsVisible(true)
        }}
        ref={wrapperRef}
      >
        <div className={classes.header}>
          <div className={classes.name}>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p className={classes.email}>{detailsVisible && user.email}</p>
          </div>
          <img src={profilePicture} alt="Profile" onClick={imageClick} />
        </div>

        {detailsVisible && (
          <div className={classes.details}>
            <hr />
            <Link to="/profile" className={classes.link}>
              Profile <RiArrowRightSLine />
            </Link>
            <hr />
          </div>
        )}
      </div>
    )

  if (mobile)
    return (
      <Link to="/profile" onClick={onClick} className={classes.link}>
        <div className={classes.mobileWrapper}>
          <div className={classes.left}>
            <img src={profilePicture} alt="Profile" />
            <div>
              {user.firstName} {user.lastName}
            </div>
          </div>
          <RiArrowRightSLine />
        </div>
      </Link>
    )
}

export default ProfileButton
