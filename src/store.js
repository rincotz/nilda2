import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'
import { Client } from "@googlemaps/google-maps-services-js/dist";
import { auth, database, storage, key, analytics, geopoint } from './firebase'

const NEXT_STEP = 'NEXT_STEP'
const PREVIOUS_STEP = 'PREVIOUS_STEP'
const DISABLE_NEXT = 'DISABLE_NEXT'
const ENABLE_NEXT = 'ENABLE_NEXT'
const STAGE_USER_SUCCESS = 'STAGE_USER_SUCCESS'
const STAGE_USER_FAIL = 'STAGE_USER_FAIL'
const STAGE_USER = 'STAGE_USER'
const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS'
const ADD_USER_FAIL = 'ADD_USER_FAIL'
const GEOLOCATE_FAIL = 'GEOLOCATE_FAIL'

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
      dispatch(stageUser({ ...user, geopoint: geopoint(lat, lng) }))
    }).catch(error => analytics.logEvent(GEOLOCATE_FAIL, { 'user': user.uid, 'error': error.message }))
  }
}

export const addUser = user => {
  return dispatch => {
    return database.collection(user.atividade).doc(user.uid).set(user)
      .then(() => {
        return auth.currentUser.updateEmail(user.email)
          .then(() => auth.currentUser.updatePassword(user.senha))
          .then(() => {
            analytics.logEvent(ADD_USER_SUCCESS, { 'user': user.uid })
            return database.collection('incompletos').doc(user.uid).delete()
          }).catch(error => analytics.logEvent(ADD_USER_FAIL, { 'user': user.uid, 'error': error.message }))
      })
  }
}

export const getUsers = () => {
  return database.collection('contratante').get()
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

export default store