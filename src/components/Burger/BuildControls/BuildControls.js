import React from 'react';

import classes from './BuildControls.module.css';
import BuildControl from './BuildeControl/BuildControl';

const contols = [
    {label: 'Salad', type: 'salad'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type: 'meat'},
]

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {contols.map(contol => {
            return <BuildControl 
                key={contol.type}
                label={contol.label}
                added={() => props.ingredientAdded(contol.type)}
                removed={() => props.ingredientRemoved(contol.type)}
                disabled={props.disabled[contol.type]}/>;
        })}
        <button
            className={classes.OrderButton}
            onClick={props.ordered}
            disabled={!props.purchasable}>
                ORDER NOW
            </button>
    </div>
);

export default buildControls;