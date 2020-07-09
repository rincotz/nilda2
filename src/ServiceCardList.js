import React, {useEffect, useState} from "react"
import ServiceCard from "./ServiceCard"
import {geofirestore, geoponto} from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress"

export default props => {
  const [loading, setLoading] = useState(true)
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    props.getWorkers(props.service).then(workersData => {
      const availableWorkers = workersData.filter(worker => worker.cnpjVerificado && worker.disponibilidade >= props.service.numeroDiariasEm4Semanas)
      setWorkers(availableWorkers.sort((xDistance, yDistance) => xDistance - yDistance))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {
        loading
        ? <CircularProgress />
        : workers.map(worker => <ServiceCard
            key={worker.uid}
            worker={worker}
            {...props}
          />)
      }
    </div>
  )
}