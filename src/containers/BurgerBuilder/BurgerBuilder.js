import React, {Component} from 'react';
import {connect} from 'react-redux';
import Aux from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions/actionTypes';

class BurgerBuilder extends Component {
    //ALTERNATYWA DLA STATE:
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        // axios.get('https://burger-builder-b827f.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }

    updatePurchaseState(ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
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

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const updatedPrice = oldPrice + priceAddition;
    //     this.setState({
    //         totalPrice: updatedPrice, ingredients: updatedIngredients
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };
    //
    // removeInredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const updatedPrice = oldPrice - priceDeduction;
    //     this.setState({
    //         totalPrice: updatedPrice, ingredients: updatedIngredients
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        //alert("You continue!");

        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join("&");
        this.props.history.push({
            pathname: "/checkout",
            search: "?" + queryString
        });
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
        let burger = this.state.error ? <p>Ingredients can not be loaded </p> : <Spinner/>;
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
        if (this.state.loading) {
            orderSummary = <Spinner/>;
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
        ingr: state.ingredients,
        price: state.totalPrice
    };
};

const madDispatchToProps = dispatch => {
    return {
        //ingrName dostajemy przy wywołaniu tej funkcji i ustawiamy jako wartość ingredientName, któe jest potrzebne
        //w reducerze - action.ingredientName
        onIngredientAdded: (ingrName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingrName}),
        onIngredientRemoved: (ingrName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingrName})
    }
}
//modyfikujemy export tak, żeby dodać connect potrzebny do obsługi reduxa
export default connect(mapStateToProps, madDispatchToProps)(withErrorHandler(BurgerBuilder, axios));