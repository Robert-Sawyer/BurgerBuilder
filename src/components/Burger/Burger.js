import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey}/>;
            });
        }).reduce((array, element) => {
            return (array.concat(element))
        }, []);
    //Powyżej tworzę tablicę składników z wewnętrznymi tablicami każdego składnika (może byc ich więcej niż jeden) a potem redukuję,
    //żeby powstała jedns tablica składników. Poniżej: jeżeli nie ma składników, wtedy wyświetl informację.
    // console.log(transformedIngredients);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Możesz dodawać składniki</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;