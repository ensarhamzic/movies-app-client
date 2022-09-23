import classes from "./App.module.css"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar/Navbar"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import "react-notifications/lib/notifications.css"
import { NotificationContainer } from "react-notifications"
import AddCollection from "./pages/AddCollection/AddCollection"
import AddItems from "./pages/AddItems/AddItems"
import React, { useEffect } from "react"
import useHttp from "./hooks/use-http"
import { useDispatch } from "react-redux"
import { authActions } from "./store/auth-slice"
import Spinner from "./components/Spinner/Spinner"
import { collectionsActions } from "./store/collections-slice"
import { favoritesActions } from "./store/favorites-slice"
import Library from "./pages/Library/Library"
import { genresActions } from "./store/genres-slice"
import Publish from "./pages/Publish/Publish"
import Favorites from "./pages/Favorites/Favorites"
import Published from "./components/Published/Published"
import Settings from "./pages/Settings/Settings"
import Profile from "./pages/Profile/Profile"
import Dashboards from "./pages/Dashboards/Dashboards"

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY

const App = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.auth.isAuth)
  const authToken = useSelector((state) => state.auth.token)
  const genres = useSelector((state) => state.genres.data)
  const {
    error: verifyTokenError,
    isLoading: loggingIn,
    sendRequest: verifyToken,
  } = useHttp()
  const { isLoading: gettingCollections, sendRequest: getCollections } =
    useHttp()
  const { isLoading: gettingFavorites, sendRequest: getFavorites } = useHttp()
  const { isLoading: gettingGenres, sendRequest: getGenres } = useHttp()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      ;(async () => {
        const response = await verifyToken({
          url: "/users/verify",
          method: "POST",
          token,
          errorMessage: "Cannot verify stored token",
        })

        if (!response) {
          return
        }

        dispatch(authActions.login({ token, user: response.user }))
      })()
    }
  }, [dispatch, verifyToken])

  useEffect(() => {
    if (verifyTokenError) {
      localStorage.removeItem("token")
      dispatch(authActions.logout())
    }
  }, [verifyTokenError, dispatch])

  useEffect(() => {
    if (isAuth) {
      ;(async () => {
        const response = await getCollections({
          url: "/collections",
          method: "GET",
          token: authToken,
        })

        if (!response) return

        dispatch(collectionsActions.loadCollections({ collections: response }))
      })()
    }
  }, [isAuth, getCollections, authToken, dispatch])

  useEffect(() => {
    if (genres.length > 0) return
    ;(async () => {
      const response = await getGenres({
        url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`,
        method: "GET",
        defaultAPI: false,
      })

      if (!response) return

      dispatch(genresActions.loadGenres({ genres: response.genres }))
    })()
  }, [dispatch, getGenres, genres])

  useEffect(() => {
    if (isAuth) {
      ;(async () => {
        const response = await getFavorites({
          url: "/users/favorites",
          method: "GET",
          token: authToken,
        })

        if (!response) return

        dispatch(favoritesActions.loadFavorites({ favorites: response }))
      })()
    }
  }, [isAuth, getFavorites, authToken, dispatch])

  if (location.pathname.startsWith("/u/"))
    return (
      <Routes>
        <Route path="/u/:name" element={<Published />} />
      </Routes>
    )

  return (
    <>
      <Spinner
        loading={
          loggingIn || gettingCollections || gettingFavorites || gettingGenres
        }
        size={150}
      />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/library" : "/login"} />}
        />
      </Routes>

      <NotificationContainer />
      {isAuth && (
        <div className={classes.authApp}>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Navigate to="/library" />} />
            <Route path="/register" element={<Navigate to="/library" />} />
            <Route path="/library" element={<Library />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add-collection" element={<AddCollection />} />
            <Route path="/add-items" element={<AddItems />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      )}

      {!isAuth && (
        <div>
          <Navbar />
          <div className={classes.backgroundDiv} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {[
              "/library",
              "/favorites",
              "/add-collection",
              "/add-items",
              "/publish",
              "/settings",
            ].map((path, index) => {
              return (
                <Route
                  path={path}
                  element={<Navigate to="/login" />}
                  key={index}
                />
              )
            })}
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
