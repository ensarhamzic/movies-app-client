import React from "react"
import twitterIcon from "../../images/twitter.svg"
import youtubeIcon from "../../images/youtube.svg"
import instagramIcon from "../../images/instagram.svg"
import classes from "./SocialBar.module.css"

const SocialBar = () => {
  return (
    <div className={classes.wrapper}>
      <img src={twitterIcon} alt="Twitter" />
      <img src={instagramIcon} alt="Instagram" />
      <img src={youtubeIcon} alt="Youtube" />
    </div>
  )
}

export default SocialBar
