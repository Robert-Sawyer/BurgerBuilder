import React, {Component} from 'react';
import Aux from '../AuxComponent/AuxComponent';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    };

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer}
        });
        //W taki sposób (poprzez this.state) lepiej tego nie robić, lepszy spopsób powyżej.
        // this.setState({showSideDrawer: !this.state.showSideDrawer});
    };

    render() {
        return (
            <Aux>
                {/*Jesli w {} jest this.jakaśMetoda to gdyby była z nawiasami na końcu była by wykonywana (executed) ale */}
                {/*zawsze należy używać REFERENCJI do metody w klasie*/}
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;