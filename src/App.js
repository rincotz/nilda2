import React from 'react'
import ModalStepper from "./ModalStepper"
import FindNearYou from './FindNearYou'
import Home from "./Home"
import WorkerStep from "./WorkerStep";
import HirerStep from "./HirerStep";
import AddressStep from "./AddressStep";
import ServiceCardList from "./ServiceCardList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ServiceCardList />
      </header>
    </div>
  );
}

export default App;
