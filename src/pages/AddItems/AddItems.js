import React, { useState, useEffect } from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import Form from "../../components/Form/Form"
import useHttp from "../../hooks/use-http"
import classes from "./AddItems.module.css"
import { useSelector } from "react-redux"
import Select from "../../components/Select/Select"
import useInput from "../../hooks/use-input"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import NotificationManager from "react-notifications/lib/NotificationManager"
import Spinner from "../../components/Spinner/Spinner"
import InfiniteScroll from "react-infinite-scroll-component"
import { useCallback } from "react"
import MoviesList from "../../components/MoviesList/MoviesList"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const AddItems = () => {
  const collections = useSelector((state) => state.collections.data)
  const genres = useSelector((state) => state.genres.data)
  const [movies, setMovies] = useState([])
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [currentMovieName, setCurrentMovieName] = useState("")
  const { isLoading: moviesLoading, sendRequest: searchMovies } = useHttp()
  const { value: choosenCollection, onChange: onCollectionChange } = useInput()

  const {
    value: movieNameValue,
    onChange: onMovieNameChange,
    error: movieNameError,
  } = useInput((movie) => {
    if (movie.length === 0) return "Movie field is required"
    return null
  })

  const searchMoviesHandler = async () => {
    setFormSubmitted(true)
    if (movieNameError) {
      NotificationManager.error(movieNameError, "Title error!", 2000)
      return
    }
    setMovies([])
    setCurrentPage(1)
    setCurrentMovieName(movieNameValue)
  }

  const searchMoviesHelper = useCallback(async () => {
    const response = await searchMovies({
      url: `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${currentMovieName}&page=${currentPage}&include_adult=false`,
      method: "GET",
      defaultAPI: false,
    })

    if (!response) return
    let newMovies = response.results.filter((m) => {
      let movieExists = false
      movies.forEach((mov) => {
        if (mov.id === m.id) movieExists = true
      })
      return !movieExists
    })

    const getGenreById = (id) => {
      return genres.find((g) => g.id === id)
    }

    newMovies = newMovies.map((m) => {
      const newGenres = m.genre_ids.map((gid) => getGenreById(gid))
      return { ...m, genres: newGenres }
    })

    setMovies((prevMovies) => [...prevMovies, ...newMovies])
    if (currentPage >= response.total_pages) {
      setHasMore(false)
    } else {
      setHasMore(true)
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }, [currentPage, currentMovieName, searchMovies, movies, genres])

  const moviesLength = movies.length
  useEffect(() => {
    if (formSubmitted && moviesLength === 0 && currentMovieName) {
      setFormSubmitted(false)
      ;(async () => {
        await searchMoviesHelper()
      })()
    }
  }, [formSubmitted, searchMoviesHelper, moviesLength, currentMovieName])

  const moviesScrollHandler = async () => {
    if (currentPage === 1) return
    await searchMoviesHelper()
  }

  return (
    <AuthPageWrapper className={classes.content}>
      <Spinner loading={moviesLoading} className={classes.spinner} />
      <h1 className={classes.header}>Add Item To Collection</h1>
      <hr />
      {collections.length > 0 && (
        <>
          <label className={classes.label}>Select Collection</label>
          <Select
            options={collections}
            className={classes.select}
            value={choosenCollection}
            onChange={onCollectionChange}
            placeholder="--- Choose Collection ---"
          />
          <p className={classes.description}>
            Choose the collection you're adding items to. Don't need to select
            if you want to add movie to favorites
          </p>
        </>
      )}
      {collections.length === 0 && (
        <p className={classes.noCollections}>
          Create at least one collection to be able to add movies to it
        </p>
      )}
      <Form onSubmit={searchMoviesHandler}>
        <label className={classes.label}>Search For Movies</label>
        <Input
          className={classes.input}
          type="text"
          placeholder="Movie Name"
          value={movieNameValue}
          onChange={onMovieNameChange}
          error={movieNameError}
          submitted={formSubmitted}
        />{" "}
        <p className={classes.description}>Type keyword or full movie name</p>
        <Button className={classes.submit} type="submit">
          Search
        </Button>
      </Form>

      {movies.length > 0 && (
        <InfiniteScroll
          dataLength={movies.length}
          next={moviesScrollHandler}
          hasMore={hasMore}
          loader={<h4>Loading more...</h4>}
          // endMessage={
          //   <p style={{ textAlign: "center" }}>
          //     <b>Yay! You have seen it all</b>
          //   </p>
          // }
        >
          <MoviesList movies={movies} collection={choosenCollection} />
        </InfiniteScroll>
      )}
    </AuthPageWrapper>
  )
}

export default AddItems
