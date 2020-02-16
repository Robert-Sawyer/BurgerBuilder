import * as actionTypes from '../actions/actionTypes';

const initialState = {
    ingredients: {
        bacon: 0,
        salad: 0,
        cheese: 0,
        meat: 0
    },
    totalPrice: 4
};

const INGREDIENTS_PRICES = {
    salad: 0.4,
    cheese: 0.5,
    meat: 1.3,
    bacon: 0.7
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    //pierwsze klonowanie robi nam klona obiektu initial state, ale ingredients w środku to kolejny obiekt i
                    //pojedyncze ... nie zrobi głębokiego klona, dlatego w kolejym obiekcie w środku musimy zrobić to samo
                    ...state.ingredients,
                    //w nawiasach kwadratowych w tym przypadku umieszczamy zmienną, która przechowa nam nazwy składników
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENTS_PRICES[action.ingredientName]
            };
        default:
            return state;
    }
};

export default reducer;