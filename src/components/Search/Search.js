import React, { useState } from "react"
import classes from "./Search.module.css"
import { GrSearch, GrClose } from "react-icons/gr"
import Form from "../Form/Form"
import Input from "../Input/Input"
import Card from "../Card/Card"

const Search = ({ movies, onSearch, active, onClose, value, onChange }) => {
  const [searchFocused, setSearchFocused] = useState(false)

  const searchFocusHandler = () => {
    setSearchFocused(true)
  }

  const searchBlurHandler = () => {
    setSearchFocused(false)
  }

  const searchHandler = () => {
    if (!value) return

    let newMovies = [...movies]
    newMovies = newMovies.filter((m) => {
      const query = value.toLowerCase().trim()
      if (query.startsWith("r:") || query.startsWith("R:")) {
        const rating = query.substring(2).trim()
        return m.vote_average === parseFloat(rating)
      }

      if (query.startsWith("g:") || query.startsWith("G:")) {
        const genre = query.substring(2).trim()
        return m.genres.some((g) => g.name.toLowerCase().includes(genre))
      }

      const titleMatch = m.title.toLowerCase().includes(query.trim())
      return titleMatch
    })
    onSearch(newMovies)

    setSearchFocused(false)
  }

  return (
    <>
      <div className={classes.search}>
        <GrSearch className={classes.searchIcon} />
        <Form onSubmit={searchHandler} className={classes.searchForm}>
          <Input
            type="text"
            placeholder="Search for movies in collection"
            value={value}
            onChange={onChange}
            onFocus={searchFocusHandler}
            onBlur={searchBlurHandler}
          />
        </Form>
        {active && (
          <GrClose className={classes.closeSearch} onClick={onClose} />
        )}
      </div>
      {searchFocused && (
        <Card className={classes.searchInstructions}>
          <p>Search for movies by typing at least one letter</p>
          <p>
            Start your search with <mark>r:</mark> or <mark>R:</mark> to search
            for specific movies rating
          </p>
          <p>
            Start your search with <mark>g:</mark> or <mark>G:</mark> to search
            for specific movies genre
          </p>
        </Card>
      )}
    </>
  )
}

export default Search
