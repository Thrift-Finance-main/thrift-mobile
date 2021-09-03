const increaseCounter = (value: any) => {
    return {
        type: "INCREASE_COUNTER",
        payload: value,
    }
}

const decreaseCounter = (value: any) => {
    return {
        type: "DECREASE_COUNTER",
        payload: value,
    }
}

export {increaseCounter, decreaseCounter};
