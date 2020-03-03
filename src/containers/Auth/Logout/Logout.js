import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from '../../../store/actions/index'

class Logout extends Component {

    componentDidMount () {
    //żeby dodać przekierowanie po wylogowaniu są takie sposoby:
    //1 - dodać jako argument onLogout(this.props.history.push("/");
    //2 - poprzez Redirect - dodać tag w return i dodać Route w App.js
        this.props.onLogout();
    }

    render () {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);