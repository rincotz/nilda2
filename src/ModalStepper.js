import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import {
  nextStep,
  previousStep,
  stageUser,
  addPic,
  addGeopoint,
  addUser,
  addWorker
} from "./store"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import PhoneStep from "./PhoneStep";
import PersonalInfo from "./PersonalInfo";
import ProfilePic from "./ProfilePic";
import AddressForm from "./AddressForm";
import HirerForm from "./HirerForm";
import WorkerForm from "./WorkerForm";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  root: {
    maxWidth: '100%',
    flexGrow: 1
  }
}))

const ModalStepper = props => {
  const classes = useStyles()
  const formSteps = [
    <PhoneStep {...props} />,
    <PersonalInfo {...props} />,
    <ProfilePic {...props} />,
    <AddressForm {...props} />,
    props.user.atividade === 'contratante' ? <HirerForm {...props} /> : <WorkerForm {...props} />
  ]
  const nextButton = (
    <Button
      size='small'
      onClick={() => props.nextStep()}
    >
      Next
      <KeyboardArrowRight />
    </Button>
  )
  const backButton = (
    <Button
      size='small'
      onClick={() => props.previousStep()}
      disabled={props.step < 1}
    >
      Back
      <KeyboardArrowLeft />
    </Button>
  )

  return (
    <div className={classes.paper}>
      <Modal
        open={props.open}
        onClose={() => props.close()}
        aria-labelledby='sign-in-modal'
      >
        <Fragment>
          <MobileStepper
            variant='dots'
            steps={formSteps.length}
            position='static'
            activeStep={props.step}
            className={classes.root}
            nextButton={nextButton}
            backButton={backButton}
          />
          {formSteps[props.step]}
        </Fragment>
      </Modal>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  stageUser: user => dispatch(stageUser(user)),
  addPic: user => dispatch(addPic(user)),
  addGeopoint: user => dispatch(addGeopoint(user)),
  addUser: user => dispatch(addUser(user)),
  addWorker: worker => dispatch(addWorker(worker))
})

const mapStateToProps = state => ({
  step: state.step,
  isNextDisabled: state.isNextDisabled,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalStepper)