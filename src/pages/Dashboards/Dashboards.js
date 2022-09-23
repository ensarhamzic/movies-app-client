import React, { useEffect, useState } from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import classes from "./Dashboards.module.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import ReactSelect from "react-select"
import { useSelector } from "react-redux"
import useHttp from "../../hooks/use-http"
import Spinner from "../../components/Spinner/Spinner"
import Card from "../../components/Card/Card"
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const genresOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Movies By Genres",
    },
  },
}
const ratingsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Movies By Rating",
    },
  },
}

const Dashboards = () => {
  const collections = useSelector((state) => state.collections.data)
  const collectionsOptions = collections.map((c) => {
    return { label: c.name, value: c.id }
  })
  collectionsOptions.unshift({ label: "All Collections", value: 0 })
  const [collection, setCollection] = useState(collectionsOptions[0])

  const genres = useSelector((state) => state.genres.data)
  const [genresChartData, setGenresChartData] = useState(null)
  const [ratingsChartData, setRatingsChartData] = useState(null)

  const { sendRequest: getMovieDetails } = useHttp()
  const [movies, setMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)

  useEffect(() => {
    // prepares data for ratings chart
    const ratingsLabels = [
      "0-1",
      "1-2",
      "2-3",
      "3-4",
      "4-5",
      "5-6",
      "6-7",
      "7-8",
      "8-9",
      "9-10",
    ]

    let data = ratingsLabels.map((l) => 0)
    if (movies.length > 0) {
      movies.forEach((m) => {
        // for every movie, floor its rating and update that number on that data array index.
        // 0 index is for 0-1 rated movies (1 is excluded)
        // 1 index is for 1-2 rated movies (2 is excluded)
        // ...etc
        if (m.vote_average === 10) data[m.vote_average - 1]++
        else data[Math.floor(m.vote_average)]++
      })
    }

    setRatingsChartData({
      labels: ratingsLabels,
      datasets: [
        {
          label: collection.label,
          data,
          backgroundColor: "#38929f",
        },
      ],
    })
  }, [movies, collection])

  useEffect(() => {
    if (genres.length === 0) return
    const labels = genres.map((g) => g.name)
    let data = labels.map((l) => 0)
    if (movies.length > 0) {
      data = []
      genres.forEach((g) => {
        let moviesNum = 0
        movies.forEach((m) => {
          const movieGenres = m.genres.map((g) => g.id)
          if (movieGenres.includes(g.id)) moviesNum++
        })
        data.push(moviesNum)
      })
    }
    setGenresChartData({
      labels,
      datasets: [
        {
          label: collection.label,
          data,
          backgroundColor: "#4bc1d2",
        },
      ],
    })
  }, [genres, movies, collection])

  useEffect(() => {
    if (!collection) return
    const tempMovies = []
    ;(async () => {
      setLoadingMovies(true)
      let allMovies = []
      if (collection.value) {
        allMovies = [
          ...collections.find((c) => c.id === parseInt(collection.value))
            .movies,
        ]
      } else {
        collections.forEach((c) => {
          allMovies = [...allMovies, ...c.movies]
        })
      }

      for (const movie of allMovies) {
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
  }, [getMovieDetails, collection, collections])

  return (
    <AuthPageWrapper className={classes.wrapper}>
      <Spinner loading={loadingMovies} />
      <h1 className={classes.header}>Dashboards</h1>
      <hr />
      <p className={classes.selectTitle}>Choose Collection</p>
      <ReactSelect
        options={collectionsOptions}
        value={collection}
        onChange={setCollection}
      />
      {genresChartData && (
        <Card className={classes.card}>
          <p className={classes.chartTitle}>Movies By Genres</p>
          <Bar options={genresOptions} data={genresChartData} />
        </Card>
      )}
      {ratingsChartData && (
        <Card className={classes.card}>
          <p className={classes.chartTitle}>Movies By Rating</p>
          <Bar
            options={ratingsOptions}
            data={ratingsChartData}
            style={{ height: "300px !important" }}
          />
        </Card>
      )}
    </AuthPageWrapper>
  )
}

export default Dashboards
