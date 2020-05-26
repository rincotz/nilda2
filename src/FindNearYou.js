import React from 'react'
import moment from "moment"
import { database } from "./firebase"
import { getUsers } from "./store"
import {Button} from "@material-ui/core";

const getDistance = (place1, place2) => {
  const toRad = x => x * Math.PI / 180
  const earthRay = 6371 //km

  const latDist = toRad(place2.latitude - place1.latitude)
  const longDist = toRad(place2.longitude - place1.longitude)

  const a = Math.sin(latDist / 2) * Math.sin(latDist / 2) +
    Math.cos(toRad(place1.latitude)) * Math.cos(toRad(place2.latitude)) *
    Math.sin(longDist / 2) * Math.sin(longDist / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = earthRay * c

  return d
}

export default props => {
  console.log(moment().format('ddd'))
  const getWorkers = () => {
    return database.collection(props.user.atividade).doc(props.user.uid).get()
      .then(snapshot => database.collection('trabalhador').get()
        .then(collection => collection.docs.filter(doc => console.log(doc.data().quaLivre))))
  }

  //getDistance(snapshot.data().geopoint, doc.data().geopoint)
  return (
    <Button onClick={() => getWorkers()} >carregar dados</Button>
  )
}