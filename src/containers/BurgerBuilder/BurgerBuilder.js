import React, {useState, useEffect} from 'react';
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

const burgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const {onInitIngredients} = props;
    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
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
    };

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
        //przekierowanie do checkout gdy zaloguje się po uprzednim stworzeniu burgera
            props.onSetAuthRedirectPath("/checkout");
            props.history.push("/auth");
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        //initPurchase dajemy tutaj a nie w checkoucie ponieważ wtedy nie dało by się złożyć ponownego zamówienia a
        //przekierowywało by z powrotem po dodaniu składników
        props.onInitPuchase();
        props.history.push("/checkout");
    };

        const disabledInfo = {
            //zmieniamy state.ingredients na props.ingr ponieważ ZMAPOWALIŚMY STATE NA PROPS w metodzie na dole strony
            ...props.ingr
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        const maxQuantityInfo = {
            ...props.ingr
        };

        for (let key in maxQuantityInfo) {
            maxQuantityInfo[key] = maxQuantityInfo[key] >= 3
        }

        let orderSummary = null;
        let burger = props.error ? <p>Ingredients can not be loaded </p> : <Spinner/>;
        if (props.ingr) {
            burger = (
                <Aux>
                    {/*tu będzie wizualizacja Burgera*/}
                    <Burger ingredients={props.ingr}/>
                    {/*//tu będzie panel zarządzający usuwaniem i dodawaniem skłądników*/
                    }
                    <BuildControls
                        addedIngredients={props.onIngredientAdded}
                        removedIngredients={props.onIngredientRemoved}
                        disabled={disabledInfo}
                        maxQuantity={maxQuantityInfo}
                        purchaseble={updatePurchaseState(props.ingr)}
                        isAuth={props.isAuthenticated}
                        ordered={purchaseHandler}
                        price={props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={props.ingr}
                price={props.price}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}/>;
        }

        return (
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
};

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
};

//modyfikujemy export tak, żeby dodać connect potrzebny do obsługi reduxa
export default connect(mapStateToProps, madDispatchToProps)(withErrorHandler(burgerBuilder, axios));