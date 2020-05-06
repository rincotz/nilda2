import React from "react"
import * as firebase from "firebase/app"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

export default props => {
  return (
    <div>
      <StyledFirebaseAuth
        firebaseAuth={firebase.auth()}
        uiConfig={{
          callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
              if (authResult.user.email) {
                return props.close
              } else {
                props.nextStep()
                props.stageUser({
                  uid: authResult.user.uid,
                  telefone: authResult.user.phoneNumber
                })
              }
            }
          },
          signInOptions: [{
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            whitelistedCountries: ['BR']
          }]
        }}
      />
    </div>
  )
}