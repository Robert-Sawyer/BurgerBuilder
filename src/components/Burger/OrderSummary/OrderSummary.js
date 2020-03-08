import React from 'react';
import Aux from '../../../hoc/AuxComponent/AuxComponent';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientsSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{textTransform: "capitalize"}}>{igKey}</span>: {props.ingredients[igKey]}
                </li>);
        });
    return (
        <Aux>
            <h3>Twoje zamówienie</h3>
            <p>Dodałeś/aś następujące składniki do swojego Burgera:</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p><strong>Całkowita cena: {props.price.toFixed(2)}</strong></p>
            <p>Czy chcesz kontynuować?</p>
            <Button btnType="Danger" clicked={props.purchaseCancelled}>ANULUJ</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>KONTYNUUJ</Button>
        </Aux>
    );
};

export default orderSummary;

//gdy zwracamy tylko jsx dajemy nawiasy okrągłę, gdy obiekt, lub coś większego z returnem - wtedy klamry