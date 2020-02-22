import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
    //idea tego, co jest pod spodem jest taka, że po odświeżeniu strony np. w momencie składania zamówienia
    //nastąpi przekierowanie z powrotem na stronę główną i wyzerowanie ingrediencji
        let summary = <Redirect to='/'/>
        if (this.props.ingr) {
            summary = (
                <div>
                    <CheckoutSummary
                      ingredients={this.props.ingr}
                      checkoutCancelled={this.checkoutCancelledHandler}
                      checkoutContinued={this.checkoutContinuedHandler}/>
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        //dzięki redux możemy zastąpić render property tą poniżej i teraz nie potrzebujemy mapować ceny price
                        component={ContactData}/>)}/>
                </div>
             );
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ingr: state.ingredients
    }
};

export default connect(mapStateToProps)(Checkout);