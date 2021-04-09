import './App.css';
import ElevatorSystem from './ElevatorSystem';

function App() {
  return (
    <div className="App">
      <ElevatorSystem elevatorCount={4} floorCount={10}></ElevatorSystem>
    </div>
  );
}

export default App;