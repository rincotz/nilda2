import React, {useEffect, useState} from "react"
import ServiceCard from "./ServiceCard"
import {geofirestore, geoponto} from "./firebase";
import CircularProgress from "@material-ui/core/CircularProgress"

export default props => {
  const [loading, setLoading] = useState(true)
  const [workers, setWorkers] = useState([])
  const getWorkers = () => {
    return geofirestore.collection('seg').near({ center: geoponto(-23.5842437, -46.7314929), radius: 10 }).get()
  }
  useEffect(() => {
    getWorkers().then(workersData => {
      workersData.docs.map(worker => (
        setWorkers([...workers, {...worker.data(), distance: worker.distance}])
      ))
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
          />)
      }
    </div>
  )
}