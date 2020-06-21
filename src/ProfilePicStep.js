import React, {useState} from "react"
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none'
  }
}))

const ProfilePicStep = props => {
  const [foto, setFoto] = useState('')
  const classes = useStyles()

  return (
    <div>
      <input
        type='file'
        className={classes.input}
        id='contained-button-file'
        accept='image/*'
        multiple={false}
        onChange={e => setFoto(e.target.files[0])}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant='outlined'
          component='span'
        >
          Adicionar Foto
        </Button>
      </label>
      <Button
        variant='outlined'
        onClick={() => {
          props.nextStep()
          if (foto) {
            props.addPic({ ...props.user, foto })
          }
        }}
      >avançar
      </Button>
    </div>
  )
}

// ProfilePicStep.propTypes = {
//   nextStep: PropTypes.func.isRequired,
//   addPic: PropTypes.func.isRequired,
//   user: PropTypes.exact({
//     uid: PropTypes.string.isRequired,
//     telefone: PropTypes.string.isRequired,
//     atividade: PropTypes.string.isRequired,
//     nome: PropTypes.string.isRequired,
//     genero: PropTypes.string.isRequired,
//     nascimentoDDMMAAAA: PropTypes.string.isRequired,
//     cpf: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     senha: PropTypes.string.isRequired
//   }).isRequired
// }

export default ProfilePicStep