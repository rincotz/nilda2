import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  nextStep,
  previousStep,
  stageUser,
  addPic,
  addGeopoint,
  addHirer,
  addWorker,
  getWorkers
} from "./store"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import PhoneStep from "./PhoneStep";
import PersonalInfoStep from "./PersonalInfoStep";
import ProfilePic from "./ProfilePicStep";
import AddressStep from "./AddressStep";
import HirerStep from "./HirerStep";
import WorkerStep from "./WorkerStep";

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
    <PersonalInfoStep {...props} />,
    <ProfilePic {...props} />,
    <AddressStep {...props} />,
    props.user.atividade === 'contratante' ? <HirerStep {...props} /> : <WorkerStep {...props} />
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
  stageUser: userObject => dispatch(stageUser(userObject)),
  addPic: userObject => dispatch(addPic(userObject)),
  addGeopoint: userObject => dispatch(addGeopoint(userObject)),
  addHirer: userObject => dispatch(addHirer(userObject)),
  addWorker: userObject => dispatch(addWorker(userObject)),
  getWorkers: userObject => dispatch(getWorkers(userObject))
})

const mapStateToProps = state => ({
  step: state.step,
  isNextDisabled: state.isNextDisabled,
  user: state.user
})

// ModalStepper.propTypes = {
//   close: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
//   step: PropTypes.number.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   previousStep: PropTypes.func.isRequired,
//   addGeopoint: PropTypes.func.isRequired,
//   addHirer: PropTypes.func.isRequired,
//   addPic: PropTypes.func.isRequired,
//   addWorker: PropTypes.func.isRequired,
//   getWorkers: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
//   user: PropTypes.shape({
//     uid: PropTypes.string
//   }).isRequired,
// }

export default connect(mapStateToProps, mapDispatchToProps)(ModalStepper)