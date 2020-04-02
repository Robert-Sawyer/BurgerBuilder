import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from '../../../store/actions/index'

const logout = props => {

    useEffect(() => {
        //żeby dodać przekierowanie po wylogowaniu są takie sposoby:
        //1 - dodać jako argument onLogout(this.props.history.push("/");
        //2 - poprzez Redirect - dodać tag w return i dodać Route w App.js
        props.onLogout();
    }, []);

        return <Redirect to="/"/>;
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(logout);