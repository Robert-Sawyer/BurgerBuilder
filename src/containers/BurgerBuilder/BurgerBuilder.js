import React, {useState, useEffect, useCallback} from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
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

    //używam useSelectorów żeby zastąpić mapStatetoProps i usunąć propsy - zamiast jednej metody tworzę cztery stałe
    // zwracające te same wartości
    const ingr = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });
    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });
    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null;
    });

    //dzięki usedispatch mogę usunąć metodę useDispatchToProps i stworzyć stałą dla każdej akcji i mogę pozbyć się
    //props przed odniesieniem do elemntów state albo do metod dispatcha
    const dispatch = useDispatch();
    const onIngredientAdded = (ingrName) => dispatch(actions.addIngredient(ingrName));
    const onIngredientRemoved = (ingrName) => dispatch(actions.removeIngredient(ingrName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPuchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    // const {onInitIngredients} = props;
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
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
        //przekierowanie do checkout gdy zaloguje się po uprzednim stworzeniu burgera
            onSetAuthRedirectPath("/checkout");
            props.history.push("/auth");
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        //initPurchase dajemy tutaj a nie w checkoucie ponieważ wtedy nie dało by się złożyć ponownego zamówienia a
        //przekierowywało by z powrotem po dodaniu składników
        onInitPuchase();
        props.history.push("/checkout");
    };

        const disabledInfo = {
            //zmieniamy state.ingredients na props.ingr ponieważ ZMAPOWALIŚMY STATE NA PROPS w metodzie na dole strony
            ...ingr
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        const maxQuantityInfo = {
            ...ingr
        };

        for (let key in maxQuantityInfo) {
            maxQuantityInfo[key] = maxQuantityInfo[key] >= 3
        }

        let orderSummary = null;
        let burger = error ? <p>Ingredients can not be loaded </p> : <Spinner/>;
        if (ingr) {
            burger = (
                <Aux>
                    {/*tu będzie wizualizacja Burgera*/}
                    <Burger ingredients={ingr}/>
                    {/*//tu będzie panel zarządzający usuwaniem i dodawaniem skłądników*/
                    }
                    <BuildControls
                        addedIngredients={onIngredientAdded}
                        removedIngredients={onIngredientRemoved}
                        disabled={disabledInfo}
                        maxQuantity={maxQuantityInfo}
                        purchaseble={updatePurchaseState(ingr)}
                        isAuth={isAuthenticated}
                        ordered={purchaseHandler}
                        price={price}/>
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={ingr}
                price={price}
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

// const mapStateToProps = state => {
//     return {
//         ingr: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuthenticated: state.auth.token !== null
//     };
// };
//
// const madDispatchToProps = dispatch => {
//     return {
//         //ingrName dostajemy przy wywołaniu tej funkcji i ustawiamy jako wartość ingredientName, któe jest potrzebne
//         //w reducerze - action.ingredientName
//         onIngredientAdded: (ingrName) => dispatch(actions.addIngredient(ingrName)),
//         onIngredientRemoved: (ingrName) => dispatch(actions.removeIngredient(ingrName)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPuchase: () => dispatch(actions.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
//     }
// };

//modyfikujemy export tak, żeby dodać connect potrzebny do obsługi reduxa
export default withErrorHandler(burgerBuilder, axios);