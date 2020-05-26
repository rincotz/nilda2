import React, { useState } from 'react'
import { connect } from "react-redux"
import ModalStepper from "./ModalStepper"
import FindNearYou from "./FindNearYou"
import Login from './Login'
import { authenticate, logout, setUser } from './store'
import Button from "@material-ui/core/Button"

const Home = props => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)

  return (
    <div>
      <Login open={loginOpen} close={() => setLoginOpen(false)} authenticate={props.authenticate} user={props.user} />
      <ModalStepper user={props.user} close={() => setSignInOpen(false)} open={signInOpen} />
      <Button
        variant='outlined'
        onClick={() => props.user.uid ? props.logout() : setLoginOpen(true)}
      >
        {props.user.uid ? 'sair' : 'entrar' }
      </Button>
      {
        props.user.uid
        ? false
        : (
            <Button
              variant='outlined'
              onClick={() => setSignInOpen(true)}
            >
              fazer parte
            </Button>
          )
      }
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  authenticate: (email, password) => dispatch(authenticate(email, password))
})

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)