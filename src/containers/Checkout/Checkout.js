import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

const checkout = props => {

    const checkoutCancelledHandler = () => {
        props.history.goBack();
    };

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data');
    };

    //idea tego, co jest pod spodem jest taka, że po odświeżeniu strony np. w momencie składania zamówienia
    //nastąpi przekierowanie z powrotem na stronę główną i wyzerowanie ingrediencji
    let summary = <Redirect to='/'/>
    if (props.ingr) {
        //po złożeniu zamówienia przekieruje na główna stronę, bo purchased jest zmienione na true w momencie7
        //w którym zostaje złożone poprawne zamówienie (patrz reducers/order)
        const purchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={props.ingr}
                    checkoutCancelled={checkoutCancelledHandler}
                    checkoutContinued={checkoutContinuedHandler}/>
                <Route
                    path={props.match.path + '/contact-data'}
                    //dzięki redux mogę zastąpić render property tą poniżej i teraz nie potrzebuje mapować ceny price
                    component={ContactData}/>
            </div>
        );
    }
    return summary;
};

const mapStateToProps = state => {
    return {
        ingr: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};

export default connect(mapStateToProps)(checkout);
