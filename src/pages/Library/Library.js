import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import Movies from "../../components/Movies/Movies"
import Spinner from "../../components/Spinner/Spinner"
import useHttp from "../../hooks/use-http"
import useInput from "../../hooks/use-input"
import classes from "./Library.module.css"
import Filters from "../../components/Filters/Filters"
import CollectionHeader from "../../components/CollectionHeader/CollectionHeader"
import { useCallback } from "react"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Library = () => {
  const collections = useSelector((state) => state.collections.data)
  const [filtersShowed, setFiltersShowed] = useState(false)
  const [filtersHiding, setFiltersHiding] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const [editing, setEditing] = useState(false)

  const { value: showType, onChange: onShowTypeChange } = useInput(
    null,
    "Cover"
  )
  const { value: sorting, onChange: onSortingChange } = useInput(null, "Title")
  const [sortAscending, setSortAscending] = useState(true)
  const [filters, setFilters] = useState(null)

  const {
    value: collection,
    onChange: onCollectionChange,
    setValue: setCollection,
  } = useInput()

  const [movies, setMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [filteredMovies, setFilteredMovies] = useState([])

  const { sendRequest: getMovieDetails } = useHttp()

  let choosenCollection = null
  if (collection) {
    choosenCollection = collections.find((c) => c.id === parseInt(collection))
  }

  const sortOrderChange = () => {
    setSortAscending((prevSort) => !prevSort)
  }

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
    onCollectionChange(event)
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
          collection={collection}
          choosenCollection={choosenCollection}
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
          forCollections={true}
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
            collection={collection}
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

export default Library
