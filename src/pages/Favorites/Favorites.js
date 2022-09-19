import React, { useState, useCallback, useEffect } from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import classes from "./Favorites.module.css"
import Spinner from "../../components/Spinner/Spinner"
import CollectionHeader from "../../components/CollectionHeader/CollectionHeader"
import Movies from "../../components/Movies/Movies"
import Filters from "../../components/Filters/Filters"
import { useSelector } from "react-redux"
import useHttp from "../../hooks/use-http"
import useInput from "../../hooks/use-input"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.data)
  const [filtersShowed, setFiltersShowed] = useState(false)
  const [filtersHiding, setFiltersHiding] = useState(false)
  const [editing, setEditing] = useState(false)

  const { value: showType, onChange: onShowTypeChange } = useInput(
    null,
    "Cover"
  )
  const { value: sorting, onChange: onSortingChange } = useInput(null, "Title")
  const [sortAscending, setSortAscending] = useState(true)
  const [filters, setFilters] = useState(null)

  const [movies, setMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [filteredMovies, setFilteredMovies] = useState([])

  const { sendRequest: getMovieDetails } = useHttp()

  const sortOrderChange = () => {
    setSortAscending((prevSort) => !prevSort)
  }

  useEffect(() => {
    const tempMovies = []
    ;(async () => {
      setLoadingMovies(true)
      for (const movie of favorites) {
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
  }, [favorites, getMovieDetails])

  const animateFiltersHiding = () => {
    setFiltersHiding(true)
    setFiltersShowed(false)
    setTimeout(() => {
      setFiltersHiding(false)
    }, 300)
  }

  const filtersButtonClick = () => {
    if (filtersShowed) {
      animateFiltersHiding()
    } else {
      setFiltersShowed(true)
    }
  }

  const collectionChangeHandler = (event) => {
    setFilters(null)
    setFiltersShowed(false)
  }

  const hideFilters = useCallback(() => {
    setFiltersShowed(false)
  }, [])

  const editButtonClick = () => {
    setEditing((prevState) => !prevState)
  }

  return (
    <AuthPageWrapper className={classes.content}>
      <Spinner loading={loadingMovies} />
      <div
        className={`${classes.mainContent} ${
          filtersShowed ? classes.reduced : ""
        }`}
      >
        <CollectionHeader
          movies={movies}
          onApplyFilter={setFilteredMovies}
          onCollectionChange={collectionChangeHandler}
          loadingMovies={loadingMovies}
          filters={filters}
          showType={showType}
          onShowTypeChange={onShowTypeChange}
          onFiltersClick={filtersButtonClick}
          sorting={sorting}
          onSortingChange={onSortingChange}
          onSortOrderChange={sortOrderChange}
          sortAscending={sortAscending}
          hideFilters={hideFilters}
          forFavorites={true}
          editing={editing}
          onEditClick={editButtonClick}
        />
        <div className={classes.movies}>
          <Movies
            movies={filteredMovies}
            showType={showType}
            sortBy={sorting}
            ascending={sortAscending}
            editing={editing}
            forFavorites={true}
          />
        </div>
      </div>
      {(filtersShowed || filtersHiding) && (
        <Filters
          className={filtersHiding && classes.filtersHiding}
          onFiltersApply={setFilters}
          appliedFilters={filters}
          hideFilters={animateFiltersHiding}
        />
      )}
    </AuthPageWrapper>
  )
}

export default Favorites
