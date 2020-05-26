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
    ferias: false,
    decT: false,
    planoSaude: false,
    diasOcup: [false, false, false, false, false, false, false],
    diasLivres: [false, false, false, false, false, false, false],
    diasFolga: [false, false, false, false, false, false, false],
    verificador: [false, false, false, false, false, false, false]
  })
  const semana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

  const onChange = e => e.target.type === 'checkbox'
    ? setState({ ...state, [e.target.name]: e.target.checked })
    : setState({ ...state, [e.target.name]: e.target.value })
  const formComplete = state.verificador.filter(Boolean).length === 7 && state.cnpj && !validator.cnpj(state.cnpj)
  const send = () => {
    if (formComplete) {
      props.addWorker({ ...props.user, ...state })
    }
  }

  return (
    <Fragment>
      <div>
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
      </div>
      <FormGroup row>
        <FormHelperText>
          Marque caso você queira contratar serviços equivalentes a:
        </FormHelperText>
        <div>
          <FormControlLabel
            label='férias'
            control={
              <Checkbox
                checked={state.ferias}
                onChange={e => onChange(e)}
                name='ferias'
              />
            }
          />
          <FormControlLabel
            label='13º'
            control={
              <Checkbox
                checked={state.decT}
                onChange={e => onChange(e)}
                name='decT'
              />
            }
          />
          <FormControlLabel
            label='Plano de Saúde'
            control={
              <Checkbox
                checked={state.planoSaude}
                onChange={e => onChange(e)}
                name='planoSaude'
              />
            }
          />
        </div>
        <FormHelperText>
          Marque os dias em que você está trabalhando:
        </FormHelperText>
        <div>
          {state.diasOcup.map((dia, index) => (
            <FormControlLabel
              key={index}
              label={semana[index]}
              control={
                <Checkbox
                  disabled={state.diasOcup[index] ? false : state.verificador[index]}
                  checked={state.diasOcup[index]}
                  onChange={e => {
                    let newArray = [...state.diasOcup]
                    let auxVerificador = [...state.verificador]
                    auxVerificador[index] = e.target.checked
                    newArray[index] = e.target.checked
                    setState({ ...state, diasOcup: newArray, verificador: auxVerificador })
                  }}
                  name={`${semana[index]}Ocup`}
                />
              }
            />
          ))}
        </div>
        <FormHelperText>
          Marque os dias em que você não está trabalhando, mas gostaria de trabalhar:
        </FormHelperText>
        <div>
          {state.diasLivres.map((dia, index) => (
            <FormControlLabel
              key={index}
              label={semana[index]}
              control={
                <Checkbox
                  disabled={state.diasLivres[index] ? false : state.verificador[index]}
                  checked={state.diasLivres[index]}
                  onChange={e => {
                    let newArray = [...state.diasLivres]
                    let auxVerificador = [...state.verificador]
                    auxVerificador[index] = e.target.checked
                    newArray[index] = e.target.checked
                    setState({ ...state, diasLivres: newArray, verificador: auxVerificador })
                  }}
                  name={`${semana[index]}Livre`}
                />
              }
            />
          ))}
        </div>
        <FormHelperText>
          Marque os dias em que você não quer trabalhar:
        </FormHelperText>
        <div>
          {state.diasFolga.map((dia, index) => (
            <FormControlLabel
              key={index}
              label={semana[index]}
              control={
                <Checkbox
                  disabled={state.diasFolga[index] ? false : state.verificador[index]}
                  checked={state.diasFolga[index]}
                  onChange={e => {
                    let newArray = [...state.diasFolga]
                    let auxVerificador = [...state.verificador]
                    auxVerificador[index] = e.target.checked
                    newArray[index] = e.target.checked
                    setState({ ...state, diasFolga: newArray, verificador: auxVerificador })
                  }}
                  name={`${semana[index]}Folga`}
                />
              }
            />
          ))}
        </div>
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