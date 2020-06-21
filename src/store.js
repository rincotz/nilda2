import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'
import { Client } from "@googlemaps/google-maps-services-js/dist";
import { auth, database, storage, key, analytics, geoponto, geofirestore } from './firebase'
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
const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS'
const ADD_USER_FAIL = 'ADD_USER_FAIL'
const DELETE_INCOMPLETE_FAIL = 'DELETE_INCOMPLETE_FAIL'
const GEOLOCATE_FAIL = 'GEOLOCATE_FAIL'

moment.locale('pt-br')

const initialState = {
  user: {},
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
      .then(() => analytics.logEvent(STAGE_USER_SUCCESS, { 'user': user.uid }))
      .catch(error => analytics.logEvent(STAGE_USER_FAIL, { 'user': user.uid, 'error': error.message }))
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
    const definirAgendamentoUnix = () => {
      const proximoDia = moment({ hour: hirer.horaAgendada, minute: hirer.minAgendado }).weekday(semana.indexOf(hirer.diaAgendado) + 7)
      const diferenca = proximoDia.diff(moment(), "days")
      if (diferenca < 6) {
        return proximoDia.add(7, "days")
      } else {
        return proximoDia
      }
    }
    const serviceInfo = () => {
      const serviceInfoObject = {
        agendamento: definirAgendamentoUnix().valueOf(),
        bairro: hirer.bairro,
        cep: hirer.cep,
        cidade: hirer.cidade,
        complemento: hirer.complemento,
        coordinates: hirer.coordinates,
        numeroDeComodos: hirer.numeroDeComodos,
        criada: moment().valueOf(),
        diaAgendado: hirer.diaAgendado,
        estado: hirer.estado,
        foto: hirer.foto || '',
        numeroDiariasEm4Semanas: hirer.numeroDiariasEm4Semanas,
        horaAgendada: hirer.horaAgendada,
        logradouro: hirer.rua,
        minAgendado: hirer.minAgendado,
        nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
        nome: hirer.nome,
        numero: hirer.numero,
        pgto: '',
        status: 'pendente',
        tipoDeHabitacao: hirer.tipoDeHabitacao,
        uid: hirer.uid,
        unixStartOfDay: definirAgendamentoUnix().startOf('day').valueOf(),
        vencimentoEndOfDay: moment().endOf('day').add(2, 'days').valueOf(),
      }
      if (!hirer.dia2Agendado) {
        return {
          dia2agendado: hirer.dia2Agendado,
          ...serviceInfoObject
        }
      } else return serviceInfoObject
    }
    const hirerInfo = {
      atividade: 'contratante',
      avaliacoes: [],
      horaAgendada: hirer.horaAgendada,
      bairro: hirer.bairro,
      cep: hirer.cep,
      cidade: hirer.cidade,
      complemento: hirer.complemento,
      coordinates: hirer.coordinates,
      cpf: hirer.cpf,
      criada: moment().valueOf(),
      numeroDeComodos: hirer.numeroDeComodos,
      diaAgendado: hirer.diaAgendado,
      dia2Agendado: hirer.dia2Agendado,
      email: hirer.email,
      estado: hirer.estado,
      foto: hirer.foto || '',
      numeroDiariasEm4Semanas: hirer.numeroDiariasEm4Semanas,
      genero: hirer.genero,
      logradouro: hirer.rua,
      minAgendado: hirer.minAgendado,
      nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
      nome: hirer.nome,
      numero: hirer.numero,
      servicos: [],
      tipoDeHabitacao: hirer.tipoDeHabitacao,
      uid: hirer.uid,
      ultimoPgto: ''
    }
    const cadastroContratante = () => {
      database.collection('contratantes').doc(hirer.uid).set({hirerInfo})
    }
    const cadastroEmail = () => auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(hirer.email, hirer.senha))
    const cadastroAuth = () => auth.currentUser.updateProfile({ displayName: `${hirer.atividade} ${hirer.nome}`, photoURL: hirer.foto ||'' })
    const cadastroServico = () => database.collection('servicos').add(serviceInfo())
    return cadastroServico()
      .then(snapshot => {
        hirerInfo.servicos.push(snapshot.id)
        const includeServiceSid = database.collection('servicos').doc(snapshot.id).set({ sid: snapshot.id }, { merge: true })
        return Promise.all([cadastroContratante(), cadastroEmail(), cadastroAuth(), includeServiceSid])
      }).then(() => {
        dispatch(stageUser(hirerInfo))
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
      uid: worker.uid,
      nome: worker.nome,
      genero: worker.genero,
      coordinates: worker.coordinates,
      nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
      foto: worker.foto || '',
      disponibilidade: 4
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
      nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
      nome: worker.nome,
      numero: worker.numero,
      planoSaude: worker.planoSaude,
      serviços: [],
      telefone: worker.telefone,
      uid: worker.uid,
      validado: false
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
      nascimentoDDMMAAAA:worker.nascimentoDDMMAAAA,
      genero: worker.genero,
      ferias: worker.ferias,
      decT: worker.decT,
      planoSaude: worker.planoSaude
    })
    return Promise.all([cadastroDiarista(), cadastroEmail(), cadastroAuth(), ...cadastroDisponibilidade(), cadastroConversao()])
      .then(() => {
        return database.collection('incompletos').doc(worker.uid).delete()
          .then(() => (analytics.logEvent(ADD_USER_SUCCESS, { 'user': worker.uid }))
          ).catch(error => analytics.logEvent(DELETE_INCOMPLETE_FAIL, { 'user':worker.uid, 'error': error.message }))
      })
      .catch(errors => errors.map(error => analytics.logEvent(ADD_USER_FAIL, { 'user': worker.uid, 'error': error.message })))
  }
}

export const getWorkers = hirer => {
  return dispatch => {
    const getday = geofirestore.collection(hirer.diaAgendado).near({ center: hirer.coordinates, radius: 10 }).get()
    const getday2 = hirer.numeroDiariasEm4Semanas === 8 ? geofirestore.collection(hirer.dia2Agendado).near({ center: hirer.coordinates, radius: 10 }).get() : false
    return Promise.all([getday, getday2])
      .then(
        snapshot => snapshot.map(promise => {
          promise.docs.map(doc => console.log(doc.data()))
        })
      )
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

export default store