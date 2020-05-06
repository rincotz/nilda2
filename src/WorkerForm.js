import React, {Fragment, useState} from "react"
import TextField from "@material-ui/core/TextField"
import Checkbox from "@material-ui/core/Checkbox"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormHelperText from "@material-ui/core/FormHelperText"
import Button from "@material-ui/core/Button"
import validator from "./validator"
import { CnpjInput } from './masks'

const WorkerForm = props => {
  const [state, setState] = useState({
    cnpj: props.user.cnpj || '',
    segOcup: false,
    terOcup: false,
    quaOcup: false,
    quiOcup: false,
    sexOcup: false,
    sabOcup: false,
    domOcup: false,
    segLivre: false,
    terLivre: false,
    quaLivre: false,
    quiLivre: false,
    sexLivre: false,
    sabLivre: false,
    domLivre: false,
    segFolga: false,
    terFolga: false,
    quaFolga: false,
    quiFolga: false,
    sexFolga: false,
    sabFolga: false,
    domFolga: false
  })

  const onChange = e => e.target.type === 'checkbox'
    ? setState({ ...state, [e.target.name]: e.target.checked })
    : setState({ ...state, [e.target.name]: e.target.value })
  const formComplete = state.cnpj && !validator.cnpj(state.cnpj)
  const send = () => {
    if (formComplete) {
      props.addUser({ ...props.user, ...state })
    }
  }

  return (
    <Fragment>
      <TextField
        error={!!validator.cnpj(state.cnpj)}
        helperText={validator.cnpj(state.cnpj)}
        variant='outlined'
        onChange={e => onChange(e)}
        name='cnpj'
        label='cnpj'
        value={state.cnpj || ''}
        InputProps={{ inputComponent: CnpjInput }}
      />
      <FormGroup row>
        <FormHelperText>
          Marque os dias em que você está trabalhando:
        </FormHelperText>
        <FormControlLabel
          label='seg'
          control={
            <Checkbox
              checked={state.segOcup}
              onChange={e => onChange(e)}
              name='segOcup'
            />
          }
        />
        <FormControlLabel
          label='ter'
          control={
            <Checkbox
              checked={state.terOcup}
              onChange={e => onChange(e)}
              name='terOcup'
            />
          }
        />
        <FormControlLabel
          label='qua'
          control={
            <Checkbox
              checked={state.quaOcup}
              onChange={e => onChange(e)}
              name='quaOcup'
            />
          }
        />
        <FormControlLabel
          label='qui'
          control={
            <Checkbox
              checked={state.quiOcup}
              onChange={e => onChange(e)}
              name='quiOcup'
            />
          }
        />
        <FormControlLabel
          label='sex'
          control={
            <Checkbox
              checked={state.sexOcup}
              onChange={e => onChange(e)}
              name='sexOcup'
            />
          }
        />
        <FormControlLabel
          label='sab'
          control={
            <Checkbox
              checked={state.sabOcup}
              onChange={e => onChange(e)}
              name='sabOcup'
            />
          }
        />
        <FormControlLabel
          label='dom'
          control={
            <Checkbox
              checked={state.domOcup}
              onChange={e => onChange(e)}
              name='domOcup'
            />
          }
        />
      </FormGroup>
      <FormGroup row>
        <FormHelperText>
          Marque os dias em que você não está trabalhando, mas quer trabalhar:
        </FormHelperText>
        <FormControlLabel
          label='seg'
          control={
            <Checkbox
              disabled={state.segOcup}
              checked={state.segLivre}
              onChange={e => onChange(e)}
              name='segLivre'
            />
          }
        />
        <FormControlLabel
          label='ter'
          control={
            <Checkbox
              disabled={state.terOcup}
              checked={state.terLivre}
              onChange={e => onChange(e)}
              name='terLivre'
            />
          }
        />
        <FormControlLabel
          label='qua'
          control={
            <Checkbox
              disabled={state.quaOcup}
              checked={state.quaLivre}
              onChange={e => onChange(e)}
              name='quaLivre'
            />
          }
        />
        <FormControlLabel
          label='qui'
          control={
            <Checkbox
              disabled={state.quiOcup}
              checked={state.quiLivre}
              onChange={e => onChange(e)}
              name='quiLivre'
            />
          }
        />
        <FormControlLabel
          label='sex'
          control={
            <Checkbox
              disabled={state.sexOcup}
              checked={state.sexLivre}
              onChange={e => onChange(e)}
              name='sexLivre'
            />
          }
        />
        <FormControlLabel
          label='sab'
          control={
            <Checkbox
              disabled={state.sabOcup}
              checked={state.sabLivre}
              onChange={e => onChange(e)}
              name='sabLivre'
            />
          }
        />
        <FormControlLabel
          label='dom'
          control={
            <Checkbox
              disabled={state.domOcup}
              checked={state.domLivre}
              onChange={e => onChange(e)}
              name='domLivre'
            />
          }
        />
      </FormGroup>
      <FormGroup row>
        <FormHelperText>
          Marque os dias em que você não quer trabalhar:
        </FormHelperText>
        <FormControlLabel
          label='seg'
          control={
            <Checkbox
              disabled={state.segOcup || state.segLivre}
              checked={state.segFolga}
              onChange={e => onChange(e)}
              name='segFolga'
            />
          }
        />
        <FormControlLabel
          label='ter'
          control={
            <Checkbox
              disabled={state.terOcup || state.terLivre}
              checked={state.terFolga}
              onChange={e => onChange(e)}
              name='terFolga'
            />
          }
        />
        <FormControlLabel
          label='qua'
          control={
            <Checkbox
              disabled={state.quaOcup || state.quaLivre}
              checked={state.quaFolga}
              onChange={e => onChange(e)}
              name='quaFolga'
            />
          }
        />
        <FormControlLabel
          label='qui'
          control={
            <Checkbox
              disabled={state.quiOcup || state.quiLivre}
              checked={state.quiFolga}
              onChange={e => onChange(e)}
              name='quiFolga'
            />
          }
        />
        <FormControlLabel
          label='sex'
          control={
            <Checkbox
              disabled={state.sexOcup || state.sexLivre}
              checked={state.sexFolga}
              onChange={e => onChange(e)}
              name='sexFolga'
            />
          }
        />
        <FormControlLabel
          label='sab'
          control={
            <Checkbox
              disabled={state.sabOcup || state.sabLivre}
              checked={state.sabFolga}
              onChange={e => onChange(e)}
              name='sabFolga'
            />
          }
        />
        <FormControlLabel
          label='dom'
          control={
            <Checkbox
              disabled={state.domOcup || state.domLivre}
              checked={state.domFolga}
              onChange={e => onChange(e)}
              name='domFolga'
            />
          }
        />
        <Button
          variant='outlined'
          onClick={() => props.previousStep()}
        >voltar
        </Button>
        <Button
          disabled={!formComplete}
          variant='outlined'
          onClick={() => send()}
        >avançar
        </Button>
      </FormGroup>
    </Fragment>
  )
}

export default WorkerForm