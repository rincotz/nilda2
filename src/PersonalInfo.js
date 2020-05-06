import React, { Fragment, useState } from "react"
import { BirthInput, IdInput } from "./masks";
import validator from "./validator"
import TextField from "@material-ui/core/TextField"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

const PersonalInfo = props => {
  const [state, setState] = useState({
    atividade: props.user.atividade || '',
    nome: props.user.nome || '',
    sexo: props.user.sexo || '',
    nascimento: props.user.nascimento || '',
    cpf: props.user.cpf || '',
    email: props.user.email || '',
    senha: ''
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const onChange = e => setState({ ...state, [e.target.name]: e.target.value })

  const formComplete = state.atividade && state.nome && !validator.nome(state.nome) && state.nascimento && !validator.nascimento(state.nascimento) && state.cpf && !validator.cpf(state.cpf) && state.email && !validator.email(state.email) && state.senha && !validator.senha(state.senha)
  const send = () => {
    if (formComplete) {
      props.stageUser({ ...props.user, ...state })
      props.nextStep()
    }
  }

  return (
    <Fragment>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='atividade'
        label='quero'
        value={state.atividade || ''}
      >
        <MenuItem
          value=''
          disabled
        >
          Selecione uma opção:
        </MenuItem>
        <MenuItem
          value='contratante'
        >
          contratar
        </MenuItem>
        <MenuItem
          value='trabalhador'
        >
          trabalhar
        </MenuItem>
      </TextField>
      <TextField
        error={!!validator.nome(state.nome)}
        helperText={validator.nome(state.nome)}
        variant='outlined'
        onChange={e => onChange(e)}
        name='nome'
        label='nome'
        value={state.nome || ''}
      />
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='sexo'
        label='sexo'
        value={state.sexo || ''}
      >
        <MenuItem
          disabled
          value=''
        >
          Selecione uma opção:
        </MenuItem>
        <MenuItem
          value='masculino'
        >
          masculino
        </MenuItem>
        <MenuItem
          value='feminino'
        >
          feminino
        </MenuItem>
      </TextField>
      <TextField
        error={!!validator.nascimento(state.nascimento)}
        helperText={validator.nascimento(state.nascimento)}
        variant='outlined'
        onChange={e => onChange(e)}
        name='nascimento'
        label='nascimento'
        value={state.nascimento || ''}
        InputProps={{ inputComponent: BirthInput }}
      />
      <TextField
        error={!!validator.cpf(state.cpf)}
        helperText={validator.cpf(state.cpf)}
        variant='outlined'
        onChange={e => onChange(e)}
        name='cpf'
        label='cpf'
        value={state.cpf || ''}
        InputProps={{ inputComponent: IdInput }}
      />
      <TextField
        error={!!validator.email(state.email)}
        helperText={validator.email(state.email)}
        variant='outlined'
        onChange={e => onChange(e)}
        name='email'
        label='email'
        value={state.email || ''}
      />
      <OutlinedInput
        error={!!validator.senha(state.senha)}
        type={mostrarSenha ? 'text' : 'password'}
        id='standard-adornment-password'
        variant='outlined'
        onChange={e => onChange(e)}
        name='senha'
        placeholder='senha'
        value={state.senha || ''}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='mostrar/esconder senha'
              onClick={() => setMostrarSenha(!mostrarSenha)}
              onMouseDown={e => e.preventDefault()}
              edge='end'
            >
              {mostrarSenha ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      <InputLabel htmlFor='standard-adornment-password'>
        {validator.senha(state.senha)}
      </InputLabel>
      <Button
        disabled={!formComplete}
        variant='outlined'
        onClick={() => send()}
      >avançar
      </Button>
    </Fragment>
  )
}

export default PersonalInfo