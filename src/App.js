import React from 'react'
import ModalStepper from "./ModalStepper"
import FindNearYou from './FindNearYou'
import Home from "./Home"
import WorkerForm from "./WorkerForm";
import HirerForm from "./HirerForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HirerForm user={''} />
      </header>
    </div>
  );
}

export default App;
