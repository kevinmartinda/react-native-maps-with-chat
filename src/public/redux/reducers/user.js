const initialState = {
    isLoading: true,
    isError: false,
    token: '',
    data: ''
}

export default user = (state = initialState, action) => {
    switch(action.type){
        case 'SET_UUID':
            return {
                ...state,
                data: action.payload
            }
        default:
            return state
    }
}