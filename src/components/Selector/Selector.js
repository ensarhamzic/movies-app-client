import React, { useState, useRef } from "react"
import useOutsideClickEvent from "../../hooks/use-outside-click-event"
import classes from "./Selector.module.css"
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri"
import Input from "../Input/Input"
import useInput from "../../hooks/use-input"
import { useEffect } from "react"

const Selector = ({ className, value, onChange, options }) => {
  const [focused, setFocused] = useState(false)
  const [filteredCollections, setFilteredCollections] = useState([])
  const wrapperRef = useRef(null)
  const {
    value: searchQuery,
    onChange: onSearchQueryChange,
    setValue: setSearchQuery,
  } = useInput()
  useOutsideClickEvent(wrapperRef, () => {
    if (focused) {
      setFocused(false)
      setSearchQuery("")
    }
  })

  const currentCollection = options.find((c) => c.id === value)

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCollections([...options])
      return
    }

    const filtered = options.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCollections([...filtered])
  }, [searchQuery, options])

  const collectionClickHandler = (event) => {
    setFocused(false)
    setSearchQuery("")
    const value = parseInt(event.target.getAttribute("value"))
    const e = { ...event, target: { ...event.target, value } }
    onChange(e)
  }

  return (
    <div
      className={`${classes.wrapper} ${focused && classes.focusedWrapper} ${
        className || ""
      }`}
      ref={wrapperRef}
    >
      <div
        className={classes.mainContent}
        onClick={() => {
          setFocused((prevState) => !prevState)
        }}
      >
        <div className={classes.collectionName}>
          {currentCollection?.name || "--Select Collection--"}
        </div>

        {focused && <RiArrowDownSLine />}
        {!focused && <RiArrowRightSLine />}
      </div>
      {focused && (
        <div className={classes.focusedContent}>
          <Input
            type="text"
            className={classes.search}
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search for a collection..."
          />
          {filteredCollections.length > 0 &&
            filteredCollections.map((c) => (
              <div
                className={classes.searchResult}
                key={c.id}
                onClick={collectionClickHandler}
                value={c.id}
              >
                {c.name}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Selector
