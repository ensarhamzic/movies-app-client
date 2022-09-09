import classes from "./App.module.css"
import { Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar/Navbar"

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth)

  return (
    <>
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
        </div>
      )}
    </>
  )
}

export default App
