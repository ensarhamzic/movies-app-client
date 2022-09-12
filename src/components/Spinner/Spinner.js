import React from "react"
import classes from "./Spinner.module.css"
import { ClipLoader } from "react-spinners"

const Spinner = ({ loading, size = 50, color = "#4bc1d2", className }) => {
  return (
    <>
      {loading && (
        <div className={`${classes.spinnerWrapper} ${className || ""}`}>
          <ClipLoader loading={loading} size={size} color={color} />
        </div>
      )}
    </>
  )
}

export default Spinner
