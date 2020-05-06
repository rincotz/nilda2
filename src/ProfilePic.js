import React, {useState} from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none'
  }
}))

export default props => {
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