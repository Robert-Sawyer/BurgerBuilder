import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('expirationDate');
    // localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
      //ten dispatch obsługujący wylogowanie uruchowmi się PO CZASIE EXPIRATION TIME, CZYLI PO CZASIE WYGAŚNIĘCIA SESJI
            dispatch(logout());
        }, expirationTime * 1000); //mnożymy razy 100 bo czas przychodzący z response jest w sekundach a settimeout w ms
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
                console.log(authData);
                //localStorage jest mi potrzebne w uproszczeniu do stworzenia API w przeglądarce, żeby docelowo
                //trzymać usera zalogowanego nawet po przeładowaniu strony. 'token'to key a response wartość
                localStorage.setItem('token', response.data.idToken);
                //poza tokenem musze też wiedzieć kiedy wygaśnie autoryzacja:
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('expirationDate', expirationDate);
                //potrzebuję też id usera, które zawiera się w localId
                localStorage.setItem('userId', response.data.localId);
                //idToken i localId - to nazwy parametrów, które znalazłem w narzędziach developerskich po zalogowaniu
                //w aplikacji na localhoście. ten drugi to po prostu userid
                //TERAZ: po zalogowaniu i wejściu w narzędziech developerskich w redux i state widać, że w state.auth
                //mamy dane z burgerbuildera, orders i auth i tutaj mamy dostarczony token i userid z obiektu response
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            })
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
        //owijam to w new Date, żeby przekonwertować dostarczonego Stringa na typ Date
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
               dispatch(logout());
            } else {
               const userId = localStorage.getItem('userId');
               dispatch(authSuccess(token, userId));
               //metoda checkAuthTimeout musi dostać liczbę milisekund wygaśnięcia sesji, więc trzeba to obliczyć w taki sposób:
               dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
               //dzielimy przez tysiąć ponieważ w metodzie checkAuthTimeout mamy setTimeout i tam mnożymy * 1000 żeby wyrównać jednostki
            }
        }
    };
};
