import React, { Fragment, useState } from "react"
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import validator from "./validator"

const HirerStep = props => {
  const [state, setState] = useState({
    numeroDiariasEm4Semanas: props.user.numeroDiariasEm4Semanas || '',
    tipoDeHabitacao: props.user.tipoDeHabitacao || '',
    numeroDeComodos: props.user.numeroDeComodos || '',
    horaAgendada: props.user.horaAgendada || '',
    minAgendado: props.user.minAgendado || '',
    diaAgendado: props.user.diaAgendado || '',
    dia2Agendado: props.user.dia2Agendado || ''
  })
  const semana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
  const onChange = e => setState({ ...state, [e.target.name]: e.target.value })
  const formComplete = (state.numeroDiariasEm4Semanas === 8 && state.dia2Agendado && state.tipoDeHabitacao && state.numeroDeComodos > 0 && state.horaAgendada && state.diaAgendado) || (state.numeroDiariasEm4Semanas !== 8 && state.numeroDiariasEm4Semanas && state.tipoDeHabitacao && state.numeroDeComodos > 0 && state.horaAgendada && state.diaAgendado)
  const send = () => {
    if (formComplete) {
      props.addHirer({ ...props.user, ...state })
    }
  }

  return (
    <Fragment>
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='numeroDiariasEm4Semanas'
        label='frequencia'
        value={state.numeroDiariasEm4Semanas || ''}
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
        name='tipoDeHabitacao'
        label='tipo'
        value={state.tipoDeHabitacao || ''}
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
        error={!!validator.comodos(state.numeroDeComodos)}
        helperText={validator.comodos(state.numeroDeComodos)}
        variant='outlined'
        type='number'
        onChange={e => onChange(e)}
        name='numeroDeComodos'
        label='nº de cômodos'
        value={state.numeroDeComodos || ''}
      />
      <TextField
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='horaAgendada'
        label='hora'
        value={state.horaAgendada || ''}
      >
        {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
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
        name='minAgendado'
        label='min'
        value={state.minAgendado || ''}
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
        name='diaAgendado'
        label='dia'
        value={state.diaAgendado || ''}
      >
        {
          semana.map((dia, index) => (
            <MenuItem
              key={index}
              value={dia}
            >{dia}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        disabled={state.numeroDiariasEm4Semanas !== 8}
        select
        variant='outlined'
        onChange={e => onChange(e)}
        name='dia2Agendado'
        label='dia 2'
        value={state.dia2Agendado || ''}
      >
        {
          semana.map((dia, index) => (
            <MenuItem
              key={index}
              value={dia}
            >{dia}
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

// HirerStep.propTypes = {
//   previousStep: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
//   addHirer: PropTypes.func.isRequired,
//   user: PropTypes.exact({
//     uid: PropTypes.string.isRequired,
//     telefone: PropTypes.string.isRequired,
//     atividade: PropTypes.string.isRequired,
//     nome: PropTypes.string.isRequired,
//     genero: PropTypes.string.isRequired,
//     nascimentoDDMMAAAA: PropTypes.string.isRequired,
//     cpf: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     senha: PropTypes.string.isRequired,
//     foto: PropTypes.string,
//     rua: PropTypes.string.isRequired,
//     numero: PropTypes.string.isRequired,
//     complemento: PropTypes.string,
//     bairro: PropTypes.string.isRequired,
//     cep: PropTypes.string.isRequired,
//     cidade: PropTypes.string.isRequired,
//     estado: PropTypes.string.isRequired
//   }).isRequired
// }

export default HirerStep