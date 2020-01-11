import React from 'react';
import classes from './CheckoutSummary.module.css';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';

const checkoutSummary = (props) => {

    return (
        <div className={classes.CheckoutSummary}>
            <h1>Enjoy your burger. I hope it will taste well!</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                {/*props.ingredents bierze się z componentu Burger gdzie ustawiamy Object.keys jako ingredients*/}
                <Burger ingredients={props.ingredients}/>
            </div>
            {/*btnType i clicked bierze się z komponentu Button*/}
            <Button
                btnType="Danger"
                clicked={props.checkoutCancelled}>CANCEL</Button>
            <Button
                btnType="Success"
                clicked={props.checkoutContinued}>CONTINUE</Button>
        </div>
    );
};

export default checkoutSummary;