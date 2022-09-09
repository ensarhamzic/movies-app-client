import React from "react"
// import classes from "./Form.module.css"

const Form = ({ children, onSubmit }) => {
  const formSubmitHandler = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return <form onSubmit={formSubmitHandler}>{children}</form>
}

export default Form
