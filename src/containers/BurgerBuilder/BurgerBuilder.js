import React, {Component} from 'react';
import {connect} from 'react-redux';
import Aux from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

export class BurgerBuilder extends Component {

    state = {
        purchasing: false
    };

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKeys => {
                return ingredients[igKeys];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        //zamiast ustawiać state (dzieki redux nie musimy już tego robić) zwracamy sumę składników - jeśli coś zostanie
        //dodane do burgera wtedy będzie mozna złożyć zamówienie. Teraz metoda przyjmuje składniki a zwraca booleana
        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
        //przekierowanie do checkout gdy zaloguje się po uprzednim stworzeniu burgera
            this.props.onSetAuthRedirectPath("/checkout");
            this.props.history.push("/auth");
        }
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
//initPurchase dajemy tutaj a nie w checkoucie ponieważ wtedy nie dało by się złożyć ponownego zamówienia a
//przekierowywało by z powrotem po dodaniu składników
        this.props.onInitPuchase();
        this.props.history.push("/checkout");
    };

    render() {
        const disabledInfo = {
            //zmieniamy state.ingredients na props.ingr ponieważ ZMAPOWALIŚMY STATE NA PROPS w metodzie na dole strony
            ...this.props.ingr
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        const maxQuantityInfo = {
            ...this.props.ingr
        };

        for (let key in maxQuantityInfo) {
            maxQuantityInfo[key] = maxQuantityInfo[key] >= 3
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can not be loaded </p> : <Spinner/>;
        if (this.props.ingr) {
            burger = (
                <Aux>
                    {/*tu będzie wizualizacja Burgera*/}
                    <Burger ingredients={this.props.ingr}/>
                    {/*//tu będzie panel zarządzający usuwaniem i dodawaniem skłądników*/
                    }
                    <BuildControls
                        addedIngredients={this.props.onIngredientAdded}
                        removedIngredients={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        maxQuantity={maxQuantityInfo}
                        purchaseble={this.updatePurchaseState(this.props.ingr)}
                        isAuth={this.props.isAuthenticated}
                        ordered={this.purchaseHandler}
                        price={this.props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ingr}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingr: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
};

const madDispatchToProps = dispatch => {
    return {
        //ingrName dostajemy przy wywołaniu tej funkcji i ustawiamy jako wartość ingredientName, któe jest potrzebne
        //w reducerze - action.ingredientName
        onIngredientAdded: (ingrName) => dispatch(actions.addIngredient(ingrName)),
        onIngredientRemoved: (ingrName) => dispatch(actions.removeIngredient(ingrName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPuchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
//modyfikujemy export tak, żeby dodać connect potrzebny do obsługi reduxa
export default connect(mapStateToProps, madDispatchToProps)(withErrorHandler(BurgerBuilder, axios));