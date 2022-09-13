import React from "react"
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

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Library = () => {
  const collections = useSelector((state) => state.collections.data)
  const [choosenLetter, setChoosenLetter] = useState("ALL")
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const { sendRequest: getMovieDetails } = useHttp()
  const { value: collection, onChange: onCollectionChange } = useInput()

  let choosenCollection = null
  if (collection) {
    choosenCollection = collections.find((c) => c.id === parseInt(collection))
  }

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
        tempMovies.push(response)
      }
      setMovies([...tempMovies])
      setLoadingMovies(false)
    })()
  }, [getMovieDetails, choosenCollection, collection])

  useEffect(() => {
    if (!choosenCollection || loadingMovies) return
    if (choosenLetter === "ALL") {
      setFilteredMovies([...movies])
    } else if (choosenLetter === "#") {
      setFilteredMovies(
        movies.filter((m) => m.title.charAt(0).match(/[^a-zA-z]/))
      )
    } else {
      setFilteredMovies(
        movies.filter((m) => m.title.charAt(0) === choosenLetter)
      )
    }
  }, [choosenCollection, loadingMovies, choosenLetter, movies])

  const collectionChanged = (event) => {
    onCollectionChange(event)
    setChoosenLetter("ALL")
  }

  return (
    <AuthPageWrapper className={classes.content}>
      <Spinner loading={loadingMovies} />
      <div className={classes.header}>
        <div className={classes.search}></div>
        <div className={classes.headerActions}>
          <Select
            value={collection}
            onChange={collectionChanged}
            options={collections}
            className={classes.collectionSelect}
            placeholder="--- Choose Collection ---"
          />
        </div>
        <LetterFilter
          className={classes.letters}
          onChange={setChoosenLetter}
          choosenLetter={choosenLetter}
        />
      </div>
      <div className={classes.movies}>
        <Movies movies={filteredMovies} />
      </div>
    </AuthPageWrapper>
  )
}

export default Library
