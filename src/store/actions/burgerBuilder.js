import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';


export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingr: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
         axios.get('https://burger-builder-b827f.firebaseio.com/ingredients.json')
         .then(response => {
         //robimy dispatch akcji, jeżeli dostajemy dostępne ingrediencje z geta
             dispatch(setIngredients(response.data));
         })
         .catch(error => {
         //ustawiam też akcję dla error
            dispatch(fetchIngredientsFailed());
         });
    };
};