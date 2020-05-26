import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'
import { Client } from "@googlemaps/google-maps-services-js/dist";
import { auth, database, storage, key, analytics, geoponto } from './firebase'
import * as firebase from 'firebase'
import moment from "moment"

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
const WORKER_AVAILABILITY = 'WORKER_AVAILABILITY'
const WORKER_AVAILABILITY_FAIL = 'WORKER_AVAILABILITY_FAIL'
const WORKER_CONVERSION = 'WORKER_CONVERSION'
const WORKER_CONVERSION_FAIL = 'WORKER_CONVERSION_FAIL'


const initialState = {
  user: {},
  step: 0,
  isNextDisabled: true
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

export const disableNext = () => {
  return dispatch => {
    dispatch({ type: DISABLE_NEXT })
  }
}

export const enableNext = () => {
  return dispatch => {
    dispatch({ type: ENABLE_NEXT })
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
      dispatch(stageUser({ ...user, geoponto: geoponto(lat, lng) }))
    }).catch(error => analytics.logEvent(GEOLOCATE_FAIL, { 'user': user.uid, 'error': error.message }))
  }
}

export const addUser = user => {
  return dispatch => {
    return database.collection(user.atividade).doc(user.uid).set(user)
      .then(() => {
        return auth.currentUser.updateEmail(user.email)
          .then(() => auth.currentUser.updatePassword(user.senha))
          .then(() => auth.currentUser.updateProfile({ displayName: `${user.atividade} ${user.nome}`, photoURL: user.foto }))
          .then(() => {
            analytics.logEvent(ADD_USER_SUCCESS, { 'user': user.uid })
            return database.collection('incompletos').doc(user.uid).delete()
          }).catch(error => analytics.logEvent(ADD_USER_FAIL, { 'user': user.uid, 'error': error.message }))
      })
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
      nascimento: worker.nascimento,
      foto: worker.foto,
      quadro: []
    }
    const cadastroDiarista = () => {
      database.collection('diaristas').doc(worker.uid).set({
        agenda: [worker.diasOcup[0] ? 0 : worker.diasLivres[0] ? 2 : 1, worker.diasOcup[1] ? 0 : worker.diasLivres[1] ? 2 : 1, worker.diasOcup[2] ? 0 : worker.diasLivres[2] ? 2 : 1, worker.diasOcup[3] ? 0 : worker.diasLivres[3] ? 2 : 1, worker.diasOcup[4] ? 0 : worker.diasLivres[4] ? 2 : 1, worker.diasOcup[5] ? 0 : worker.diasLivres[5] ? 2 : 1, worker.diasOcup[6] ? 0 : worker.diasLivres[6] ? 2 : 1],
        atividade: 'diarista',
        avaliacoes: [],
        bairro: worker.bairro,
        cep: worker.cep,
        cidade: worker.cidade,
        cnpj: worker.cnpj,
        complemento: worker.complemento,
        cpf: worker.cpf,
        criada: moment().valueOf(),
        decT: worker.decT,
        diasTrab: 0,
        diasConversao,
        email: worker.email,
        estado: worker.estado,
        ferias: worker.ferias,
        foto: worker.foto,
        genero: worker.genero,
        geoponto: worker.geoponto,
        historico: [],
        logradouro: worker.rua,
        nascimento: worker.nascimento,
        nome: worker.nome,
        numero: worker.numero,
        planoSaúde: worker.planoSaude,
        telefone: worker.telefone,
        uid: worker.uid
      })
    }
    const cadastroEmail = () => auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(worker.email, worker.senha))
    const cadastroAuth = () => auth.currentUser.updateProfile({displayName: `${worker.atividade} ${worker.nome}`, photoURL: worker.foto})
    const cadastroDisponibilidade = () => worker.diasLivres.filter((day, index) => {
      const promiseArray = []
      day && promiseArray.push(database.collection(semana[index]).doc(worker.uid).set(workerCardInfo))
      return promiseArray
    })
    const cadastroConversao = () => diasConversao && database.collection('conversao').doc(worker.uid).set({
      diasConversao,
      uid: worker.uid,
      nome: worker.nome,
      geoponto: worker.geoponto,
      telefone: worker.telefone,
      nascimento:worker.nascimento,
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

export const getUsers = (userType) => {
  return database.collection(userType).get()
    .then(snapshot => console.log(snapshot.docs.map(doc => doc.data())))
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