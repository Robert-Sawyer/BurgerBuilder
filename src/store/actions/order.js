import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId = id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

//powyższe actionCreaters są zsynchronizowane, poniżej asynchroniczne

//ten actionCreater jest potrzebny w momencie kliknięcia w przycisk ORDER. Robię dispatcha i korzystam z redux-thunk middleware
export const purchaseBurgerStart = (orderData) => {
    return dispatch => {
        axios.post('orders.json', orderData)
            .then(response => {
                console.log(response.data);
                dispatch(purchaseBurgerSuccess(response.data, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error));
            });
    };
};
