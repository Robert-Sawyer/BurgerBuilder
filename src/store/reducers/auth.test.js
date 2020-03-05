import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
    it('should return the initial state',() => {
        //bez żadnych dostarczonych argumentów - niezdefiniowany state i pustyobiekt akcji zwróci pierwotny state
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });

    it('should return the initial state',() => {
    //dostarczam initial state
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
        //dostarczam pożądana akcję
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userId:'some-id'
            //otrzymuję zaktualizoawny state o nowe wartości
        })).toEqual({
            token: 'some-token',
            userId: 'some-id',
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });
});