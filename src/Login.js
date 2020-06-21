import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel"
import Button from "@material-ui/core/Button"
import Modal from "@material-ui/core/Modal"
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

const Login = props => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (props.user.uid) {props.close()}
  })

  return (
    <Modal open={props.open} onClose={props.close}>
      <div>
        <TextField
          variant='outlined'
          onChange={e => setLogin(e.target.value)}
          label='email'
          name='email'
          value={login}
        />
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          id='standard-adornment-password'
          variant='outlined'
          onChange={e => setPassword(e.target.value)}
          name='senha'
          placeholder='senha'
          value={password}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='mostrar/esconder senha'
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={e => e.preventDefault()}
                edge='end'
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        <InputLabel error={true} htmlFor='standard-adornment-password'>
          {errorMessage}
        </InputLabel>
        <Button
          variant='outlined'
          onClick={() => {
            props.authenticate(login, password)
              .then(() => setPassword(''))
              .catch(e => setErrorMessage(e.message))
          }}
        >entrar
        </Button>
      </div>
    </Modal>
  )
}

// Login.propTypes = {
//   authenticate: PropTypes.func.isRequired,
//   close: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
//   user: PropTypes.shape({
//     uid: PropTypes.string
//   }).isRequired
// }

export default Login