import './ElevatorSystem.css';
import Elevator from './Elevator'
import React, { useEffect, useState } from 'react';


function distance(destFloor, currentFloor, direction, maxFloor) {
    if ((destFloor === currentFloor)) return 0;
    if ((destFloor < currentFloor && direction <= 0) || (destFloor > currentFloor && direction >= 0)) return Math.abs(destFloor - currentFloor);
    if ((destFloor < currentFloor)) return maxFloor - currentFloor + maxFloor - destFloor;
    if ((destFloor < currentFloor)) return currentFloor + destFloor;
}

function initializeElevatorsPositions(elevatorsCount) {
    const elevatorsPositions = [];
    for (let i = 0; i < elevatorsCount; i++) {
        elevatorsPositions.push(
            {
                id: i,
                floor: 0,
                direction: 0
            }
        )
    }

    return elevatorsPositions;
}


function ElevatorSystem(props) {
    const [elevatorCount, setElevatorCount] = useState(props.elevatorCount);
    const [floorCount, setFloorCount] = useState(props.floorCount);
    const [width, setWidth] = useState(props.elevatorCount * 90);
    const [height, setHeight] = useState(props.floorCount * 30);
    const [orders, setOrders] = useState(new Array(props.elevatorCount).fill(null))


    const [elevatorsPositions, setElevators] = useState(initializeElevatorsPositions(props.elevatorCount));

    const onElevatorFloorChange = (id, floor, direction) => {
        const elevatorId = id;
        const indexToUpdate = elevatorsPositions.findIndex((elem) => { return elem.id === elevatorId });
        if (indexToUpdate >= 0) {
            elevatorsPositions[indexToUpdate] = {
                id: id,
                floor: floor,
                direction: direction
            };

            setElevators(elevatorsPositions);
        }
    }

    const handleChangeChk = (chkId) => {
        let min_idx = 0;
        let min_d = distance(chkId, elevatorsPositions[0].floor, elevatorsPositions[0].direction, props.floorCount);
        for (let i = 1; i < elevatorsPositions.length; i++) {
            let maybe_min = distance(chkId, elevatorsPositions[i].floor, elevatorsPositions[i].direction, props.floorCount);
            if (maybe_min < min_d) {
                min_d = maybe_min;
                min_idx = i;
            }
        }

        const order = {
            elevatorId: elevatorsPositions[min_idx].id,
            destFloor: chkId
        }
        let copyOrders = [...orders];
        copyOrders[elevatorsPositions[min_idx].id] = order;
        setOrders(copyOrders);
        return;
    }

    const buildingStyle = {
        width,
        height
    }

    const buttons = []
    for (let i = 0; i < props.floorCount; i++) {
        buttons.push(
            <input key={i} type="button" onClick={() => handleChangeChk(i)} value={i} />
        )
    }

    let elevators = [];
    for (let i = 0; i < elevatorCount; i++) {
        elevators.push(<div key={i} className="Building-elevator"><Elevator order={orders[i]} onFloorChange={onElevatorFloorChange} id={i} width={width / 9} floorCount={floorCount} /></div>)
    }

    return (
        <div style={buildingStyle} className="Building">
            <div className="Building-buttons-container"> {buttons} </div>
            {elevators}
        </div>
    )
}

export default ElevatorSystem;