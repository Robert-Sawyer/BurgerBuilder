import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
    isEnglishLanguage: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SWITCH_LANGUAGE:
            return updateObject(state, {isEnglishLanguage: false});
        default: return state;
    }
};

export default reducer;