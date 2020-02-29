import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
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
                //to jest odpowiednik nazwy składnika, np mięsa i jego zaktualizowanej ilośći po dodaniu do burgera
            const updatedIngredientAdd = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
                //a to po prostu kopia samego obiektu ingredients z pierwotnego stanu
            const updatedIngredientsAdd = updateObject(state.ingredients, updatedIngredientAdd);
            const updatedStateAdd = {
                ingredients: updatedIngredientsAdd,
                totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName]
            };
            return updateObject(state, updatedStateAdd);
        case actionTypes.REMOVE_INGREDIENT:
            const updatedIngredientRem = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
            const updatedIngredientsRem = updateObject(state.ingredients, updatedIngredientRem);
            const updatedStateRem = {
                ingredients: updatedIngredientsRem,
                totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName]
            };
            return updateObject(state, updatedStateRem);
            //Ten case jest realizowany w momencie załadowania od nowa strony głównej a konkretnie belki ze składnikami
        case actionTypes.SET_INGREDIENTS:
            return updateObject(state, {
                 ingredients: action.ingr,
    //      ŻEBY RĘCZNIE ZMIENIĆ KOLEJNOŚĆ WYŚWIETLANYCH SKŁADNIKÓW MOŻNA TO ZROBIĆ TAK: (ALBO ZMIENIĆ KOLEJNOŚĆ W FIREBASE)
    //                ingredients: {
    //                salad: action.ingr.salad,
    //                meat: action.ingr.meat
    //                itp
    //                }
                totalPrice: 4,
                error: false
            });
         case actionTypes.FETCH_INGREDIENTS_FAILED:
            return updateObject(state, {error: true});
        default:
            return state;
    }
};

export default reducer;