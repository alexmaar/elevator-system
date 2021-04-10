import './App.css';
import './Form.css';
import ElevatorSystem from './ElevatorSystem';
import React, { useEffect, useState } from 'react';

function App() {

  const [elevatorCount, setElevatorCount] = useState(0)
  const [floorCount, setFloorCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)


  const handleSubmit = () => {
    setSubmitted(true);
  }

  if (!submitted) {
    return (
    <div className="Form">
      <form id="input-form" onSubmit={handleSubmit}>
      <label>
        Elevators number:
      <input type="text" onChange={e => setElevatorCount(e.target.value)} />
      </label>
      <label>
        Floors number:
      <input type="text" onChange={e => setFloorCount(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
    </div>
    );
  }
  else {
    return (
    <div className="App" >
      <ElevatorSystem elevatorCount={elevatorCount} floorCount={floorCount}></ElevatorSystem>
    </div>
    );
  }
}

export default App;