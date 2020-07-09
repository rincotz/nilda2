import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'
import { Client } from "@googlemaps/google-maps-services-js/dist";
import { auth, database, storage, key, analytics, geoponto, geofirestore } from './firebase'
import logger from "./logger"
import * as firebase from 'firebase'
import moment from "moment"
import 'moment/locale/pt-br'

const NEXT_STEP = 'NEXT_STEP'
const PREVIOUS_STEP = 'PREVIOUS_STEP'
const DISABLE_NEXT = 'DISABLE_NEXT'
const ENABLE_NEXT = 'ENABLE_NEXT'
const SET_USER = 'SET_USER'
const CLEAN_USER = 'CLEAN_USER'
const STAGE_USER_SUCCESS = 'STAGE_USER_SUCCESS'
const STAGE_USER_FAIL = 'STAGE_USER_FAIL'
const STAGE_USER = 'STAGE_USER'
const STAGE_SERVICE = 'STAGE_SERVICE'
const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS'
const ADD_USER_FAIL = 'ADD_USER_FAIL'
const DELETE_INCOMPLETE_FAIL = 'DELETE_INCOMPLETE_FAIL'
const GEOLOCATE_FAIL = 'GEOLOCATE_FAIL'

moment.locale('pt-br')

const initialState = {
  user: {},
  service: {},
  step: 0,
}

export const nextStep = () => {
  return dispatch => {
    dispatch({ type: NEXT_STEP })
  }
}

export const previousStep = () => {
  return dispatch => {
    dispatch({ type: PREVIOUS_STEP })
  }
}

export const setUser = () => {
  return dispatch => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        dispatch({ type: SET_USER, user })
      } else {
        dispatch({ type: CLEAN_USER })
      }
    })
  }
}

export const authenticate = (email, password) => {
  return dispatch => {
    return auth.signInWithEmailAndPassword(email, password)
      .then(authToken => dispatch(setUser(authToken.user)))
  }
}

export const logout = () => {
  return dispatch => {
    return auth.signOut()
      .then(dispatch({ type: CLEAN_USER }))
  }
}

export const stageUser = user => {
  return dispatch => {
    dispatch({ type: STAGE_USER, user })
    return database.collection('incompletos').doc(user.uid).set(user)
      .then(() => logger(STAGE_USER_SUCCESS, { 'user': user.uid }))
      .catch(error => logger(STAGE_USER_FAIL, { 'user': user.uid, 'error': error.message }))
  }
}

export const stageService = service => {
  return dispatch => {
    console.log(service)
    dispatch({ type: STAGE_SERVICE, service })
  }
}

export const addPic = user => {
  return dispatch => {
    return storage.ref(`fotoPerfil/${user.uid}`).put(user.foto)
      .then(snapshot => snapshot.ref.getDownloadURL()
        .then(foto => dispatch(stageUser({ ...user, foto }))))
  }
}

const client = new Client({})

export const addGeopoint = user => {
  return dispatch => {
    return client.geocode({
      params: {
        address: `${user.rua}, ${user.numero} ${user.bairro}, ${user.cidade} - ${user.estado} ${user.cep}`,
        region: 'br',
        language: 'pt-BR',
        key
      }
    }).then(({ data }) => {
      const { lat, lng } = data.results[0].geometry.location
      dispatch(stageUser({ ...user, coordinates: geoponto(lat, lng) }))
    }).catch(error => analytics.logEvent(GEOLOCATE_FAIL, { 'user': user.uid, 'error': error.message }))
  }
}

export const addHirer = hirer => {
  return dispatch => {
    const semana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
    const minimoAgendamentoMoment = () => {
      const proximoDia = moment({ hour: hirer.horaAgendada, minute: hirer.minAgendado }).weekday(semana.indexOf(hirer.diaAgendado) + 7)
      const diferenca = proximoDia.diff(moment(), "days")
      if (diferenca < 6) {
        return proximoDia.add(7, "days")
      } else {
        return proximoDia
      }
    }
    const doc = database.collection('servicos').doc()
    const sid = doc.id
    const serviceInfo = {
      agendamento: minimoAgendamentoMoment().valueOf(),
      bairro: hirer.bairro,
      cep: hirer.cep,
      cidade: hirer.cidade,
      complemento: hirer.complemento,
      contratante: {
        foto: hirer.foto || '',
        genero: hirer.genero,
        meioDeContatoPreferido: hirer.meioDeContatoPreferido,
        nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
        nome: hirer.nome,
        telefone: hirer.telefone,
        uid: hirer.uid
      },
      coordinates: hirer.coordinates,
      numeroDeComodos: hirer.numeroDeComodos,
      criada: moment().valueOf(),
      diaAgendado: hirer.diaAgendado,
      estado: hirer.estado,
      numeroDiariasEm4Semanas: hirer.numeroDiariasEm4Semanas,
      horaAgendada: hirer.horaAgendada,
      logradouro: hirer.rua,
      minAgendado: hirer.minAgendado,
      nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
      numero: hirer.numero,
      pgto: '',
      sid,
      status: 'pendente',
      tipoDeHabitacao: hirer.tipoDeHabitacao,
      trabalhador: '',
      unixStartOfDay: minimoAgendamentoMoment().startOf('day').valueOf(),
      vencimentoEndOfDay: moment().endOf('day').add(2, 'days').valueOf(),
    }
    const hirerInfo = {
      atividade: 'contratante',
      avaliacoes: [],
      bairro: hirer.bairro,
      cep: hirer.cep,
      cidade: hirer.cidade,
      complemento: hirer.complemento,
      coordinates: hirer.coordinates,
      cpf: hirer.cpf,
      criada: moment().valueOf(),
      numeroDeComodos: hirer.numeroDeComodos,
      email: hirer.email,
      estado: hirer.estado,
      foto: hirer.foto || '',
      genero: hirer.genero,
      logradouro: hirer.rua,
      meioDeContatoPreferido: hirer.meioDeContatoPreferido,
      nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
      nome: hirer.nome,
      servicos: [sid],
      telefone: hirer.telefone,
      tipoDeHabitacao: hirer.tipoDeHabitacao,
      uid: hirer.uid,
      ultimoPgto: ''
    }
    const cadastroContratante = () => database.collection('contratantes').doc(hirer.uid).set(hirerInfo)
    const cadastroEmail = () => auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(hirer.email, hirer.senha))
    const cadastroAuth = () => auth.currentUser.updateProfile({ displayName: `${hirer.atividade} ${hirer.nome}`, photoURL: hirer.foto ||'' })
    const cadastroServicos = () => database.collection('servicos').doc(sid).set(serviceInfo)
    return Promise.all([cadastroContratante(), cadastroEmail(), cadastroAuth(), cadastroServicos()])
      .then(() => {
        dispatch({ type: STAGE_USER, hirerInfo })
        dispatch(stageService(serviceInfo))
        analytics.logEvent(ADD_USER_SUCCESS, { 'user': hirer.uid })
        return database.collection('incompletos').doc(hirer.uid).delete()
      }).catch(error => analytics.logEvent(ADD_USER_FAIL, { 'user': hirer.uid, 'error': error.message }))
  }
}

export const addWorker = worker => {
  return dispatch => {
    const semana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
    const diasConversao = worker.diasOcup.filter(Boolean).length
    const workerCardInfo = {
      agendamentos: [],
      cnpjVerificado: false,
      contratantes: [],
      disponibilidade: 4,
      uid: worker.uid,
      nome: worker.nome,
      genero: worker.genero,
      coordinates: worker.coordinates,
      meioDeContatoPreferido: worker.meioDeContatoPreferido,
      nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
      servicos: [],
      foto: worker.foto || '',
      telefone: worker.telefone,
    }
    const workerInfo = {
      agenda: [worker.diasOcup[0] ? 0 : worker.diasLivres[0] ? 2 : 1, worker.diasOcup[1] ? 0 : worker.diasLivres[1] ? 2 : 1, worker.diasOcup[2] ? 0 : worker.diasLivres[2] ? 2 : 1, worker.diasOcup[3] ? 0 : worker.diasLivres[3] ? 2 : 1, worker.diasOcup[4] ? 0 : worker.diasLivres[4] ? 2 : 1, worker.diasOcup[5] ? 0 : worker.diasLivres[5] ? 2 : 1, worker.diasOcup[6] ? 0 : worker.diasLivres[6] ? 2 : 1],
      atividade: 'diarista',
      avaliacoes: [],
      bairro: worker.bairro,
      cep: worker.cep,
      cidade: worker.cidade,
      cnpj: worker.cnpj,
      complemento: worker.complemento,
      coordinates: worker.coordinates,
      cpf: worker.cpf,
      criada: moment().valueOf(),
      decT: worker.decT,
      diasTrab: 0,
      diasConversao,
      email: worker.email,
      estado: worker.estado,
      ferias: worker.ferias,
      foto: worker.foto || '',
      genero: worker.genero,
      logradouro: worker.rua,
      meioDeContatoPreferido: worker.meioDeContatoPreferido,
      nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
      nome: worker.nome,
      numero: worker.numero,
      planoSaude: worker.planoSaude,
      servicosRealizados: [],
      telefone: worker.telefone,
      uid: worker.uid,
      cnpjVerificado: false
    }
    dispatch(stageUser(workerInfo))
    const cadastroDiarista = () => {
      database.collection('diaristas').doc(worker.uid).set(workerInfo)
    }
    const cadastroEmail = () => auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(worker.email, worker.senha))
    const cadastroAuth = () => auth.currentUser.updateProfile({displayName: `${worker.atividade} ${worker.nome}`, photoURL: worker.foto || ''})
    const cadastroDisponibilidade = () => worker.diasLivres.filter((day, index) => {
      const promiseArray = []
      day && promiseArray.push(geofirestore.collection(semana[index]).doc(worker.uid).set(workerCardInfo))
      return promiseArray
    })
    const cadastroConversao = () => diasConversao && database.collection('conversao').doc(worker.uid).set({
      diasConversao,
      uid: worker.uid,
      nome: worker.nome,
      coordinates: worker.coordinates,
      telefone: worker.telefone,
      meioDeContatoPreferido: worker.meioDeContatoPreferido,
      nascimentoDDMMAAAA:worker.nascimentoDDMMAAAA,
      genero: worker.genero,
      ferias: worker.ferias,
      decT: worker.decT,
      planoSaude: worker.planoSaude,
      cnpjVerificado: false
    })
    return Promise.all([cadastroDiarista(), cadastroEmail(), cadastroAuth(), ...cadastroDisponibilidade(), cadastroConversao()])
      .then(() => {
        return database.collection('incompletos').doc(worker.uid).delete()
          .then(() => (analytics.logEvent(ADD_USER_SUCCESS, { 'user': worker.uid }))
          ).catch(error => analytics.logEvent(DELETE_INCOMPLETE_FAIL, { 'user':worker.uid, 'error': error.message }))
      })
      .catch(error => analytics.logEvent(ADD_USER_FAIL, { 'user': worker.uid, 'error': error.message }))
  }
}

export const getWorkers = serviceInfo => {
  return dispatch => {
    const workers = []
    return geofirestore.collection(serviceInfo.diaAgendado).near({ center: serviceInfo.coordinates, radius: 10 }).get()
      .then(workersData => {
        workersData.docs.map(worker => workers.push({
          ...worker.data(), distance: worker.distance
        }))
        return workers
      })
  }
}

export const aceitarDiarista = (serviceInfo, worker) => {
  return dispatch => {
    const semana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
    const minimoAgendamentoMoment = () => {
      const proximoDia = moment({ hour: serviceInfo.horaAgendada, minute: serviceInfo.minAgendado }).weekday(semana.indexOf(serviceInfo.diaAgendado) + 7)
      const diferenca = proximoDia.diff(moment(), "days")
      if (diferenca < 6) {
        return proximoDia.add(7, "days").valueOf()
      } else {
        return proximoDia
      }
    }
    const workerAvailabilityRef = database.collection(serviceInfo.diaAgendado).doc(worker.uid)
    const serviceRef = database.collection('servicos').doc(serviceInfo.sid)
    return database.runTransaction(transaction => {
      return transaction.get(workerAvailabilityRef).then(res => {
        const newAvailability = res.data().disponibilidade - serviceInfo.numeroDiariasEm4Semanas
        const agendamentos = res.data().agendamentos
        const contratantes = res.data().contratantes
        let diaMinimo = minimoAgendamentoMoment()
        const diaAgendado = () => {
          while (agendamentos.indexOf(diaMinimo) !== -1) {
            newAvailability === 2 && serviceInfo.numeroDiariasEm4Semanas === 1 ? diaMinimo.add(14, 'days') : diaMinimo.add(7, 'days')
          }
          return diaMinimo.dayOfYear()
        }
        agendamentos.push(diaAgendado())
        contratantes.push(serviceInfo.contratante.uid)
        transaction.update(serviceRef, { diarista: worker.uid  })
        transaction.update(workerAvailabilityRef, { agendamentos, disponibilidade: newAvailability, contratantes })
      })
    })
  }
}

const userSubscription = (state = initialState, action) => {
  switch (action.type) {
    case NEXT_STEP:
      return { ...state, step: state.step + 1 }
    case PREVIOUS_STEP:
      return { ...state, step: state.step - 1 }
    case DISABLE_NEXT:
      return { ...state, isNextDisabled: true }
    case ENABLE_NEXT:
      return { ...state, isNextDisabled: false }
    case SET_USER:
      return { ...state, user: {
        ...state.user, uid: action.user.uid, atividade: action.user.displayName ? action.user.displayName.split(' ')[0] : ''
      }}
    case CLEAN_USER:
      return { ...state, user: {} }
    case STAGE_USER:
      return { ...state, user: { ...state.user, ...action.user } }
    case STAGE_SERVICE:
      return { ...state, service: { ...state.service, ...action.service } }
    default:
      return state
  }
}

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const enhancer = composeEnhancers(applyMiddleware(thunk))

const store = createStore(
  userSubscription,
  enhancer
)

store.dispatch(setUser())
logger('testing', {name: test})

export default store