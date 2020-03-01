import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type: 'meat'},
    {label: 'Salad', type: 'salad'}
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
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
            onClick={props.ordered}>ORDER NOW
        </button>
    </div>
);

export default buildControls;