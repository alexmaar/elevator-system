import './Elevator.css';
import React, { useEffect, useState, useRef, useMemo } from 'react'

function distance(destFloor, currentFloor, direction, maxFloor) {
    if ((destFloor === currentFloor)) return 0;
    if ((destFloor < currentFloor && direction < 0) || (destFloor > currentFloor && direction > 0)) return Math.abs(destFloor - currentFloor);
    if ((destFloor < currentFloor)) return maxFloor - currentFloor + maxFloor - destFloor;
    if ((destFloor < currentFloor)) return currentFloor + destFloor;
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function initState(id) {
    const state = {
        id: id,
        direction: 1,
        doorsState: 'CLOSED',
        desiredFloors: [],
        floor: 0
    }
    return state;
}

function Elevator({ id, floorCount, width, order, onFloorChange}) {
    const [state, setMyState] = useState(initState(id));
    useInterval(() => {
        const newState = step(state);
        if(newState !== null){
            setMyState(newState);
            setFloor(newState.floor);
            setDirection(newState.direction);
        }
    }, 1000);
    const [floor, setFloor] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (order && !state.desiredFloors.includes(order.destFloor)) {
            state.desiredFloors = state.desiredFloors.concat([order.destFloor]);
            setMyState(state);
        }
    }, [order, state]);

    useEffect(() => {
        onFloorChange(state.id, floor ,direction);
    }, [state, floor, direction, onFloorChange])


    const step = (state) => {
        const cmp = (a, b) => {
            // a - b
            const dA = distance(a, state.floor, state.direction, floorCount);
            const dB = distance(b, state.floor, state.direction, floorCount);

            if (dA < dB)
                return -1;

            if (dA > dB)
                return 1;

            return 0;
        }

        if (state.desiredFloors.length === 0) {
            state.direction = 0;

            return state;
        }

        state.desiredFloors.sort(cmp);

        const desiredFloor = state.desiredFloors[0];

        if (state.doorsState === 'CLOSED' && state.floor === desiredFloor) {
            state.doorsState = 'OPEN';
            if (state.desiredFloors.length === 0){
                state.direction = 0;
            }

            return state;
        }

        if (state.doorsState === 'OPEN' && state.floor === desiredFloor) {
            state.desiredFloors.shift();
            if (state.desiredFloors.length === 0){
                state.direction = 0;
            }
            state.doorsState = 'CLOSED';

            return state;
        }

        const dir = ((desiredFloor - state.floor) < 0) ? -1 : 1;
        const next_floor = state.floor + dir;

        // just a consistency check, should never happen
        if (next_floor < 0 || next_floor >= floorCount) return null;

        state.floor = next_floor;
        state.direction = dir;


        return state;
    }

    const elevatorStyle = {
        width: width
    }

    let [possiblePlaces, setPossiblePlaces] = useState([])
    useEffect(() => {
        setPossiblePlaces([]);
        for (let i = 0; i < floorCount; i++) {
            if (i !== floor) {
                setPossiblePlaces(prev => [...prev, <div key={i} className="Elevator-empty-position"></div>])
            } else {
                setPossiblePlaces(prev => [...prev, <div key={i} className="Elevator-current-position"></div>])
            }
        }
    }, [floor, floorCount, setPossiblePlaces])
    

    return (
        <div style={elevatorStyle} className="Elevator">
            {possiblePlaces}
        </div>
    )
}

export default Elevator