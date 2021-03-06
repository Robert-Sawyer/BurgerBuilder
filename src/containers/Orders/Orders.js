import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

const orders = props => {

    const {onFetchOrders} = props;
    //pobieramy zamówienia z bazy firebase poprzez axiosa któy jest teraz w actionCreater w action/order
    useEffect(() => {
        onFetchOrders(props.token, props.userId);
    }, [onFetchOrders]);

    //gdy zamówienia się ładują wtedy wyświetl na chwilę Spinnera, a gdy się już załadują, wtedy wyświetl listę
    //zamówień (.map tworzy nową listę z propsa, który idzie z mapStateToProps i który przychodzi z reducera, który
    //pobiera go z actiona, który pobiera go axiosem z firebase'a)
    let orders = <Spinner/>
    if (!props.loading) {
        orders = props.orders.map(order => (
            //key to w tym przypadku id z firebase tak samo jak ingredients i price
            <Order key={order.id}
                   ingredients={order.ingredients}
                   price={order.price}/>
        ))
    }
    return (
        <div>
            {orders}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        //state.order idzie z reducers/order a orders to element state któy ustawiamy w case'ie
        orders: state.order.orders,
        loading: state.order.loading,
        //dodaję token bo potrzebuję go do pokazania zamówień TYLKO dla zalogowanego, więc pobieram go z auth reducera
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(orders, axios));