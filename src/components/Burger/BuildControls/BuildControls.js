import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label: 'Bekon', type: 'bacon'},
    {label: 'Ser', type: 'cheese'},
    {label: 'Mięso', type: 'meat'},
    {label: 'Sałata', type: 'salad'}
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Aktualna cena: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl
                key={ctrl.label}
                label={ctrl.label}
                added={() => props.addedIngredients(ctrl.type)}
                removed={() => props.removedIngredients(ctrl.type)}
                disabled={props.disabled[ctrl.type]}
                maxQuantity={props.maxQuantity[ctrl.type]}/>
        ))}
        <button
            className={classes.OrderButton}
            disabled={!props.purchaseble}
            onClick={props.ordered}>{props.isAuth ? 'ZAMAWIAM' : 'ZALOGUJ SIĘ, ABY ZAMÓWIĆ'}
        </button>
    </div>
);

export default buildControls;