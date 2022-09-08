import classes from "./App.module.css"
import { Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"

const App = () => {
  return (
    <div className={classes.app}>
      <Navigation />
      <Routes></Routes>
    </div>
  )
}

export default App
