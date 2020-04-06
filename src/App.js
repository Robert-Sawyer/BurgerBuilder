import React, {useEffect, Suspense} from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import './App.css';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
    return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
    return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
    return import('./containers/Auth/Auth');
});

const app = props => {

    //takie wyrażenie pozwoli na uzależnienie wykonania (ponownego zrenderowania komponentu) useEffect od props
    //ale jednocześnie zapobiegnie uruchamianiu się useEffect za każdym razem, gdy props się zmieni, a zamiast tego
    //wtedy gdy zmieni się tylko funkcja ontryautosignup. To samo robię w Auth, Logout, BurgerBuilder i Orders
    const {onTryAutoSignup} = props;
    useEffect(() => {
        onTryAutoSignup();
    }, [onTryAutoSignup]);

//JAKO DODATKOWE ULEPSZENIE MOŻNA DODAĆ JESZCZE LENIWE ŁADOWANIE IMPORTÓW POPRZEZ ASYNCCOMPONENT - PRZYKŁAD W REACT-START-APP
    let routes = (
        <Switch>
            <Route path="/auth" render={(props) => <Auth {...props}/>}/>
            <Route path="/" exact component={BurgerBuilder}/>
            <Redirect to="/"/>
        </Switch>
    );

    if (props.isAuthenticated) {
        routes = (
            <Switch>
                <Route path="/checkout" render={(props) => <Checkout {...props}/>}/>
                <Route path="/orders" render={(props) => <Orders {...props}/>}/>
                <Route path="/logout" component={Logout}/>
                <Route path="/auth" render={(props) => <Auth {...props}/>}/>
                <Route path="/" exact component={BurgerBuilder}/>
                <Redirect to="/"/>
            </Switch>
        );
    }

    return (
        <div>
            <Layout>
                {/*zastąp potem paragraf Spinnerem*/}
                <Suspense fallback={<p>Loading...</p>}>
                    {routes}
                </Suspense>
            </Layout>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
