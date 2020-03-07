import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null}
        {!props.isAuthenticated
        ? <NavigationItem link="/auth">Authenticate</NavigationItem>
        : <NavigationItem link="/logout">Logout</NavigationItem>}
        <NavigationItem>PL ENG</NavigationItem>
    </ul>
);
//do powyższego: jeśli z props, czyli z SideDrawer i Toolbar a tam z Layout, a tam z auth.state przyjdzie informacja
//że user ma token wtedy wyświetl inny kafel dla zalogowanego i niezlaogowanego

export default navigationItems;