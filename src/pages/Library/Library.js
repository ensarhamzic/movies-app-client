import React, { useCallback } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import LetterFilter from "../../components/LetterFilter/LetterFilter"
import Movies from "../../components/Movies/Movies"
import Select from "../../components/Select/Select"
import Spinner from "../../components/Spinner/Spinner"
import useHttp from "../../hooks/use-http"
import useInput from "../../hooks/use-input"
import classes from "./Library.module.css"
import Button from "../../components/Button/Button"
import { FaArrowUp, FaArrowDown } from "react-icons/fa"
import { BsFilter } from "react-icons/bs"
import Filters from "../../components/Filters/Filters"
import Search from "../../components/Search/Search"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

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

const Library = () => {
  const collections = useSelector((state) => state.collections.data)
  const [choosenLetter, setChoosenLetter] = useState("ALL")
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [filtersShowed, setFiltersShowed] = useState(false)
  const [filtersHiding, setFiltersHiding] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const [filters, setFilters] = useState(null)
  const [search, setSearch] = useState(false)
  const { sendRequest: getMovieDetails } = useHttp()
  const {
    value: collection,
    onChange: onCollectionChange,
    setValue: setCollection,
  } = useInput()
  const { value: showType, onChange: onShowTypeChange } = useInput(
    null,
    "Cover"
  )
  const { value: sorting, onChange: onSortingChange } = useInput(null, "Title")
  const [sortAscending, setSortAscendig] = useState(true)

  let choosenCollection = null
  if (collection) {
    choosenCollection = collections.find((c) => c.id === parseInt(collection))
  }

  const {
    value: searchQuery,
    onChange: onSearchQueryChange,
    setValue: setSearchQuery,
  } = useInput()

  useEffect(() => {
    if (collections.length > 0 && isInitial) {
      setCollection(collections[0].id)
      setIsInitial(false)
    }
  }, [collections, setCollection, isInitial])

  useEffect(() => {
    if (!collection) return
    const tempMovies = []
    ;(async () => {
      setLoadingMovies(true)
      for (const movie of choosenCollection.movies) {
        const response = await getMovieDetails({
          url: `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`,
          method: "GET",
          defaultAPI: false,
        })
        response.vote_average = Math.round(response.vote_average * 10) / 10
        tempMovies.push(response)
      }
      setMovies([...tempMovies])
      setLoadingMovies(false)
    })()
  }, [getMovieDetails, choosenCollection, collection])

  const filterByLetter = useCallback(
    (movs) => {
      if (choosenLetter === "ALL") {
        setFilteredMovies([...movs])
      } else if (choosenLetter === "#") {
        setFilteredMovies(
          movs.filter((m) => m.title.charAt(0).match(/[^a-zA-z]/))
        )
      } else {
        setFilteredMovies(
          movs.filter((m) => m.title.charAt(0) === choosenLetter)
        )
      }
    },
    [choosenLetter]
  )

  useEffect(() => {
    if (!choosenCollection || loadingMovies) return
    filterByLetter(movies)
  }, [choosenCollection, loadingMovies, filterByLetter, movies])

  const collectionChanged = (event) => {
    onCollectionChange(event)
    setChoosenLetter("ALL")
    setFilters(null)
    setFiltersShowed(false)
    setSearch(false)
    setSearchQuery("")
  }

  const sortOrderChange = () => {
    setSortAscendig((prevSort) => !prevSort)
  }

  const filtersButtonClick = () => {
    if (filtersShowed) {
      setFiltersHiding(true)
      setFiltersShowed(false)
      setTimeout(() => {
        setFiltersHiding(false)
      }, 300)
    } else {
      setFiltersShowed(true)
    }
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
      setFiltersShowed(false)
    }
  }, [filters, movies, filterByLetter, search])

  const searchHandler = (movies) => {
    setFilteredMovies(movies)
    setSearch(true)
    setFiltersShowed(false)
  }

  const closeSearch = () => {
    setSearch(false)
    setSearchQuery("")
  }

  return (
    <AuthPageWrapper className={classes.content}>
      <Spinner loading={loadingMovies} />
      <div
        className={`${classes.mainContent} ${
          filtersShowed ? classes.reduced : ""
        }`}
      >
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
              <Button onClick={sortOrderChange}>
                {sortAscending && <FaArrowUp />}
                {!sortAscending && <FaArrowDown />}
              </Button>
            </div>
            {!search && (
              <Button
                className={classes.filterBtn}
                onClick={filtersButtonClick}
              >
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
        <div className={classes.movies}>
          <Movies
            movies={filteredMovies}
            showType={showType}
            sortBy={sorting}
            ascending={sortAscending}
          />
        </div>
      </div>
      {(filtersShowed || filtersHiding) && (
        <Filters
          className={filtersHiding && classes.filtersHiding}
          onFiltersApply={setFilters}
          appliedFilters={filters}
        />
      )}
    </AuthPageWrapper>
  )
}

export default Library
