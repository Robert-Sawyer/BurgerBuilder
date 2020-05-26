import {put} from 'redux-saga/effects';
import * as actionTypes from '../store/actions/actionTypes';

//redux saga jest po to, żeby ograniczyć kod, który nie wpływa bezpośrednio na zmiane stanu - jak na przykład usuwanie
//elementów z localStorage
//taka funkcja (z gwiazdką) to generator - trzeba w nim użyć słowa kluczowego yield, które oznacza, że w programowaniu
//wielowątkowym proces zaczeka na wykonanie jednej linijki, potem drugiej, potem trzeciej, i w końcu czwartej
function* logout() {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put({
        type: actionTypes.AUTH_LOGOUT
    })
}