import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUsers } from "./store"

export default () => {
  getUsers()


  return (
    <p>testing</p>
  )
}