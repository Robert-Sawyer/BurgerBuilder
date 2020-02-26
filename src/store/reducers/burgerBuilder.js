import * as actionTypes from '../actions/actionTypes';

const initialState = {
//zmieniamy na null bo znowu będziemy używać axiosa
    ingredients: null,
    totalPrice: 4,
    error: false
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
            //Ten case jest realizowany w momencie załadowania od nowa strony głównej a konkretnie belki ze składnikami
        case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                ingredients: action.ingr,
//      ŻEBY RĘCZNIE ZMIENIĆ KOLEJNOŚĆ WYŚWIETLANYCH SKŁADNIKÓW MOŻNA TO ZROBIĆ TAK: (ALBO ZMIENIĆ KOLEJNOŚĆ W FIREBASE)
//                ingredients: {
//                salad: action.ingr.salad,
//                meat: action.ingr.meat
//                itp
//                }
                totalPrice: 4,
                error: false
            };
         case actionTypes.FETCH_INGREDIENTS_FAILED:
             return {
                 ...state,
                 error: true
             };
        default:
            return state;
    }
};

export default reducer;