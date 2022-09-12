import classes from "./App.module.css"
import { Routes, Route, Navigate } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar/Navbar"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import "react-notifications/lib/notifications.css"
import { NotificationContainer } from "react-notifications"
import AddCollection from "./pages/AddCollection/AddCollection"
import AddItems from "./pages/AddItems/AddItems"
import React, { useEffect, useState } from "react"
import useHttp from "./hooks/use-http"
import { useDispatch } from "react-redux"
import { authActions } from "./store/auth-slice"
import Spinner from "./components/Spinner/Spinner"
import { collectionsActions } from "./store/collections-slice"
import { favoritesActions } from "./store/favorites-slice"

const App = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.auth.isAuth)
  const authToken = useSelector((state) => state.auth.token)
  const [loggingIn, setLoggingIn] = useState(false)
  const { sendRequest: verifyToken } = useHttp()
  const { sendRequest: getCollections } = useHttp()
  const { sendRequest: getFavorites } = useHttp()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      ;(async () => {
        setLoggingIn(true)
        const response = await verifyToken({
          url: "/users/verify",
          method: "POST",
          token,
        })

        if (!response) {
          localStorage.removeItem("token")
          setLoggingIn(false)
          return
        }

        dispatch(authActions.login({ token, user: response.user }))
        setLoggingIn(false)
      })()
    }
  }, [dispatch, verifyToken])

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

  return (
    <>
      <Spinner loading={loggingIn} size={150} />
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
            <Route path="/add-collection" element={<AddCollection />} />
            <Route path="/add-items" element={<AddItems />} />
          </Routes>
        </div>
      )}

      {!isAuth && (
        <div>
          <div className={classes.backgroundDiv} />
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
