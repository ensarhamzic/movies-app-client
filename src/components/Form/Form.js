import React from "react"
// import classes from "./Form.module.css"

const Form = ({ children, onSubmit, className }) => {
  const formSubmitHandler = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={formSubmitHandler} className={className}>
      {children}
    </form>
  )
}

export default Form
