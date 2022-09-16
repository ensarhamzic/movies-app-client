import React, { useState, useCallback, useEffect } from "react"
import classes from "./Published.module.css"
import useHttp from "../../hooks/use-http"
import useInput from "../../hooks/use-input"
import Spinner from "../Spinner/Spinner"
import CollectionHeader from "../CollectionHeader/CollectionHeader"
import Movies from "../Movies/Movies"
import Filters from "../Filters/Filters"
import { useParams } from "react-router-dom"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Published = () => {
  const params = useParams()
  const name = params.name
  const [collections, setCollections] = useState([])
  const [filtersShowed, setFiltersShowed] = useState(false)
  const [filtersHiding, setFiltersHiding] = useState(false)
  const [isInitial, setIsInitial] = useState(true)

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
  const {
    isLoading: collectionsLoading,
    sendRequest: getPublishedCollections,
  } = useHttp()

  let choosenCollection = null
  if (collection) {
    choosenCollection = collections.find((c) => c.id === parseInt(collection))
  }

  useEffect(() => {
    ;(async () => {
      const response = await getPublishedCollections({
        url: `/publishes/collections?name=${name}`,
        method: "GET",
      })

      if (!response) return

      setCollections(response.map((c) => c.collection))
    })()
  }, [getPublishedCollections, name])

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

  const collectionChangeHandler = (event) => {
    onCollectionChange(event)
    setFilters(null)
    setFiltersShowed(false)
  }

  const hideFilters = useCallback(() => {
    setFiltersShowed(false)
  }, [])

  return (
    <div className={classes.content}>
      <Spinner loading={loadingMovies || collectionsLoading} />
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
          customCollections={collections}
        />
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
    </div>
  )
}

export default Published
