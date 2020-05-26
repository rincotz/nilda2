import React, {Fragment, useState} from "react"
import TextField from "@material-ui/core/TextField"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import validator from "./validator";

const HirerForm = props => {
  const [state, setState] = useState({
    frequencia: props.user.frequencia || '',
    tipo: props.user.tipo || '',
    comodos: props.user.comodos || '',
    hora: props.user.hora || '',
    min: props.user.min || '',
    periodo: props.user.periodo || '',
    dia: props.user.dia || '',
    dia2: props.user.dia2 || ''
  })
  const onChange = e => setState({ ...state, [e.target.name]: e.target.value })
  const formComplete = (state.frequencia === 8 && state.dia2 && state.tipo && state.comodos > 0 && state.hora && state.periodo && state.dia) || (state.frequencia !== 8 && state.frequencia && state.tipo && state.comodos > 0 && state.hora && state.periodo && state.dia)
  const send = () => {
    if (formComplete) {
      props.addUser({ ...props.user, ...state })
      props.nextStep()
    }
  }
  return (
    <Fragment>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='frequencia'
        label='frequencia'
        value={state.frequencia || ''}
      >
        <MenuItem
          disabled
          value=''
        >Selecione uma opção:
        </MenuItem>
        <MenuItem
          value={8}
        >2x semana
        </MenuItem>
        <MenuItem
          value={4}
        >1x semana
        </MenuItem>
        <MenuItem
          value={2}
        >2x mês
        </MenuItem>
        <MenuItem
          value={1}
        >1x mês
        </MenuItem>
      </TextField>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='tipo'
        label='tipo'
        value={state.tipo || ''}
      >
        <MenuItem
          disabled
          value=''
        >Selecione uma opção:
        </MenuItem>
        <MenuItem
          value='apartamento'
        >apartamento
        </MenuItem>
        <MenuItem
          value='casa'
        >casa
        </MenuItem>
        <MenuItem
          value='comercial'
        >comercial
        </MenuItem>
      </TextField>
      <TextField
        error={!!validator.comodos(state.comodos)}
        helperText={validator.comodos(state.comodos)}
        variant='outlined'
        type='number'
        onChange={e => onChange(e)}
        name='comodos'
        label='comodos'
        value={state.comodos || ''}
      />
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='hora'
        label='hora'
        value={state.hora || ''}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          .map((h, i) => (
            <MenuItem
              key={i}
              value={h}
            >{h}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='min'
        label='min'
        value={state.min || ''}
      >
        {['00', 15, 30, 45]
          .map((m, i) => (
            <MenuItem
              key={i}
              value={m}
            >{m}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='periodo'
        label='periodo'
        value={state.periodo || ''}
      >
        <MenuItem
          disabled
          value=''
        >
          Selecione uma opção:
        </MenuItem>
        <MenuItem
          value='am'
        >
          manhã
        </MenuItem>
        <MenuItem
          value='pm'
        >
          {state.hora < 7 ? 'tarde' : 'noite'}
        </MenuItem>
      </TextField>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='dia'
        label='dia'
        value={state.dia || ''}
      >
        {[['segunda', 'seg'], ['terça', 'ter'], ['quarta', 'qua'], ['quinta', 'qui'], ['sexta', 'sex'], ['sábado', 'sab'], ['domingo', 'dom']]
          .map((d, i) => (
            <MenuItem
              key={i}
              value={d[1]}
            >{d[0]}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        disabled={state.frequencia !== 8}
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='dia2'
        label='dia2'
        value={state.dia2 || ''}
      >
        {[['segunda', 'seg'], ['terça', 'ter'], ['quarta', 'qua'], ['quinta', 'qui'], ['sexta', 'sex'], ['sábado', 'sab'], ['domingo', 'dom']]
          .map((d, i) => (
            <MenuItem
              key={i}
              value={d[1]}
            >{d[0]}
            </MenuItem>
          ))}
      </TextField>
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
    </Fragment>
  )
}

export default HirerForm