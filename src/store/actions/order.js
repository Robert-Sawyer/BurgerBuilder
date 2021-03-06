import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};

//powyższe actionCreaters są zsynchronizowane, poniżej asynchroniczne

//ten actionCreater jest potrzebny w momencie kliknięcia w przycisk ORDER. Robię dispatcha i korzystam z redux-thunk middleware
export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('orders.json?auth=' + token, orderData)
            .then(response => {
                console.log(orderData);
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error));
            });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userId) => {
    return dispatch => {
    //dzięki temu dispatchowi w momencie ładowania zamówień na chwilę wyświetli się Spinner, ponieważ w reducerze
    //ustawiliśmy loading na true gdy uruchomi się ten actionTypes
        dispatch(fetchOrdersStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        //końcówka linku to autoryzacja usera, bo zabroniliśmy niezalogowanemu przeglądac zamówień, więc trzeba pobrać
        //token zalogowanego usera - dzieje się to w orders container gdzie pobieram token ze state auth reducera
        axios.get('orders.json' + queryParams)
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrdersFail(err));
            });
    };
};