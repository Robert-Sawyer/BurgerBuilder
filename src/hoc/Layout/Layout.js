import React, {useState} from 'react';
import Aux from '../AuxComponent/AuxComponent';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const layout = props => {

    const [visibleSideDrawer, setVisibleSideDrawer] = useState(false);

    const sideDrawerClosedHandler = () => {
        setVisibleSideDrawer(false);
    };

    const sideDrawerToggleHandler = () => {
        setVisibleSideDrawer(!visibleSideDrawer);
    };

    return (
        <Aux>
            {/*Jesli w {} jest this.jakaśMetoda to gdyby była z nawiasami na końcu była by wykonywana (executed) ale */}
            {/*zawsze należy używać REFERENCJI do metody w klasie*/}
            <Toolbar
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={visibleSideDrawer}
                closed={sideDrawerClosedHandler}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        //jeśli token jest w state wtedy wiadomo, że user jest zalogowany czyli ma autoryzację
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(layout);
