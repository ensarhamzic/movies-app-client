import React, { useState } from "react"
import classes from "./CollapsingContent.module.css"
import Card from "../Card/Card"
import { Collapse } from "react-collapse"
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri"

const CollapsingContent = ({ title, children, className, contentClass }) => {
  const [opened, setOpened] = useState(false)

  return (
    <Card className={`${classes.card} ${className && className}`}>
      <div
        className={classes.cardTitle}
        onClick={() => {
          setOpened((prevState) => !prevState)
        }}
      >
        <p>{title}</p>
        {opened && <RiArrowDownSLine />}
        {!opened && <RiArrowRightSLine />}
      </div>
      <Collapse
        isOpened={opened}
        theme={{
          collapse: classes.collapsedContent,
          content: contentClass,
        }}
      >
        {children}
      </Collapse>
    </Card>
  )
}

export default CollapsingContent
