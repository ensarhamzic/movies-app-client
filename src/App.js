import classes from "./App.module.css"
import { Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar/Navbar"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import "react-notifications/lib/notifications.css"
import { NotificationContainer } from "react-notifications"

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth)

  return (
    <>
      <NotificationContainer />
      {isAuth && (
        <div className={classes.authApp}>
          <Navigation />
          <Routes></Routes>
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
