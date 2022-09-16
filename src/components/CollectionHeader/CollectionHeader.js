import React, { useState, useEffect, useCallback } from "react"
import classes from "./CollectionHeader.module.css"
import Search from "../Search/Search"
import Select from "../Select/Select"
import Button from "../Button/Button"
import LetterFilter from "../LetterFilter/LetterFilter"
import { FaArrowUp, FaArrowDown } from "react-icons/fa"
import { BsFilter } from "react-icons/bs"
import useInput from "../../hooks/use-input"
import { useSelector } from "react-redux"

const showTypeOptions = [
  { id: "Cover", name: "Cover" },
  { id: "List", name: "List" },
  { id: "Summary", name: "Summary" },
]

const sortingOptions = [
  { id: "Title", name: "Title" },
  { id: "Release Date", name: "Release Date" },
  { id: "Rating", name: "Rating" },
]

const CollectionHeader = ({
  onApplyFilter,
  loadingMovies,
  movies,
  filters,
  collection,
  onCollectionChange,
  showType,
  onShowTypeChange,
  onFiltersClick,
  choosenCollection,
  sorting,
  onSortingChange,
  onSortOrderChange,
  sortAscending,
  hideFilters,
}) => {
  const collections = useSelector((state) => state.collections.data)
  const [choosenLetter, setChoosenLetter] = useState("ALL")

  const [search, setSearch] = useState(false)

  const {
    value: searchQuery,
    onChange: onSearchQueryChange,
    setValue: setSearchQuery,
  } = useInput()

  const filterByLetter = useCallback(
    (movs) => {
      if (choosenLetter === "ALL") {
        onApplyFilter([...movs])
      } else if (choosenLetter === "#") {
        onApplyFilter(movs.filter((m) => m.title.charAt(0).match(/[^a-zA-z]/)))
      } else {
        onApplyFilter(movs.filter((m) => m.title.charAt(0) === choosenLetter))
      }
    },
    [choosenLetter, onApplyFilter]
  )

  useEffect(() => {
    if (!choosenCollection || loadingMovies) return
    filterByLetter(movies)
  }, [choosenCollection, loadingMovies, filterByLetter, movies])

  const collectionChanged = (event) => {
    onCollectionChange(event)
    setChoosenLetter("ALL")

    setSearch(false)
    setSearchQuery("")
  }

  useEffect(() => {
    if (search) return
    if (filters) {
      let unfilteredMovies = [...movies]
      unfilteredMovies = unfilteredMovies.filter(
        (m) =>
          m.vote_average >= filters.ratings.from &&
          m.vote_average <= filters.ratings.to
      )
      if (filters.years.from)
        unfilteredMovies = unfilteredMovies.filter(
          (m) => m.release_date >= filters.years.from
        )
      if (filters.years.to) {
        unfilteredMovies = unfilteredMovies.filter(
          (m) => m.release_date <= filters.years.to
        )
      }
      if (filters.genres.length > 0)
        unfilteredMovies = unfilteredMovies.filter((m) => {
          const movieGenres = m.genres.map((g) => g.id)
          const filteredGenres = filters.genres.map((g) => g.value)
          return movieGenres.some((r) => filteredGenres.indexOf(r) >= 0)
        })

      filterByLetter(unfilteredMovies)
    } else {
      filterByLetter(movies)
      hideFilters()
    }
  }, [filterByLetter, filters, hideFilters, movies, search])

  const searchHandler = (movies) => {
    onApplyFilter(movies)
    setSearch(true)
    hideFilters()
  }

  const closeSearch = () => {
    setSearch(false)
    setSearchQuery("")
  }

  return (
    <div className={classes.header}>
      <Search
        movies={movies}
        onSearch={searchHandler}
        active={search}
        onClose={closeSearch}
        value={searchQuery}
        onChange={onSearchQueryChange}
      />
      <div className={classes.headerActions}>
        <Select
          value={collection}
          onChange={collectionChanged}
          options={collections}
          className={classes.collectionSelect}
          placeholder="--- Choose Collection ---"
        />
        <Select
          value={showType}
          onChange={onShowTypeChange}
          options={showTypeOptions}
          className={classes.showTypeSelect}
        />
        <div className={classes.sorting}>
          <Select
            value={sorting}
            onChange={onSortingChange}
            options={sortingOptions}
            className={classes.sortingSelect}
          />
          <Button onClick={onSortOrderChange}>
            {sortAscending && <FaArrowUp />}
            {!sortAscending && <FaArrowDown />}
          </Button>
        </div>
        {!search && (
          <Button className={classes.filterBtn} onClick={onFiltersClick}>
            <BsFilter />
            Filters
          </Button>
        )}
      </div>
      {!search && (
        <LetterFilter
          className={classes.letters}
          onChange={setChoosenLetter}
          choosenLetter={choosenLetter}
        />
      )}
    </div>
  )
}

export default CollectionHeader
