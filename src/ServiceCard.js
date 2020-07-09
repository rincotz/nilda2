import React from "react"
import moment from 'moment'
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import LocationOn from '@material-ui/icons/LocationOn'
import Home from '@material-ui/icons/Home'
import Store from '@material-ui/icons/Store'
import Apartment from '@material-ui/icons/Apartment'
import Alarm from '@material-ui/icons/Alarm'
import DateRange from '@material-ui/icons/DateRange'
import Person from '@material-ui/icons/Person'
import MeetingRoom from '@material-ui/icons/MeetingRoom'
import CheckCircle from '@material-ui/icons/CheckCircle'
import {database} from "firebase";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: "column",
    width: '80%',
    margin: "auto",
    marginTop: '5%',
    padding: '5%'
  },
  detailsColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  detailsRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    height: 151,
    width: 151
  }
}))

const ServiceCard = props => {
  const classes = useStyles()
  const periodicidade = {
    4: 'semanal',
    2: 'quinzenal',
    1: 'mensal'
  }
  const icone = {
    casa: <Home />,
    comercial: <Store />,
    apartamento: <Apartment />
  }
  return (
          <Card className={classes.root}>
            <div className={classes.detailsRow}>
              <CardContent>
                <div className={classes.detailsRow}>
                  <Person/>
                  <Typography>
                    {`${props.worker.nome.split(' ')[0]}, ${moment().diff(moment(props.worker.nascimentoDDMMAAAA, 'DD-MM-YYYY'), 'years')}`}
                  </Typography>
                </div>
                <div className={classes.detailsRow}>
                  <Alarm/>
                  <Typography>
                    {`${props.worker.diaAgendado} ${props.worker.horaAgendada}:${props.worker.minAgendado}`}
                  </Typography>
                </div>
                <div className={classes.detailsRow}>
                  <DateRange/>
                  <Typography>
                    {periodicidade[props.worker.numeroDiariasEm4Semanas]}
                  </Typography>
                </div>
                <div className={classes.detailsRow}>
                  <MeetingRoom/>
                  <Typography>
                    {props.worker.numeroDeComodos}
                  </Typography>
                </div>
                <div className={classes.detailsRow}>
                  {icone[props.worker.tipoDeHabitacao]}
                  <Typography>
                    {props.worker.bairro}
                  </Typography>
                </div>
                <div className={classes.detailsRow}>
                  <LocationOn/>
                  <Typography>
                    {`${props.worker.distance} km`}
                  </Typography>
                </div>
              </CardContent>
              <div className={classes.detailsColumn}>
                <CardMedia
                  className={classes.cover}
                  image={props.worker.foto}
                  title='pic'
                />
                <IconButton
                  onClick={() => props.aceitarDiarista(props.service, props.worker)}
                >
                  <CheckCircle
                    fontSize='large'
                  />
                </IconButton>
              </div>
            </div>
          </Card>
  )
}

export default ServiceCard