import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

//dodajemy dodatkowy parametr - czy jest zarejestrowany czy nie
export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        //te dane są wymagane i będą przesyłane jako json przez axios do firebase. Znalazłem je w dokumentacji (niżej)
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

//poniższy link znalazłem w firebase (firebase rest auth w google, otworzyłem stronę dokumentacji i tam:
//Reference -> rest -> api usage -> sign up with email/password. API KEY natomiast po zarejestrowaniu aplikacji
//w ustawieniach projektu i po przejściu wszystkich kroków konfiguracji w ustawiniach ogólnych na dole
//w zakładce Firebase Sdk snippet po zaznaczeniu konfiguracja jest skrypt i stamtąd trzeba skopiować kod
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA845c_lw6EqLeX0fOvQ2R-0HjRGe4Lx4E';

//w zależności czy jest zarejestrowany czy nie linki będą się różnić - oba znajduja się w dokumentacji firebase
//w zakłądkach sign up with email/password i sign in with email/password
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA845c_lw6EqLeX0fOvQ2R-0HjRGe4Lx4E';
        };

        axios.post(url, authData)
            .then(response => {
                console.log(response);
                dispatch(authSuccess(response.data));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err));
            })

    };
};