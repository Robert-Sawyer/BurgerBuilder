import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {BurgerBuilder} from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

configure({adapter: new Adapter()});

describe('<BurgerBuilder/>', () => {
    let wrapper;
    beforeEach(() => {
    //ponieważ BurgerBuilder jest contenerem muszę dostarczyć funkcję z componentDidMount
        wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>);
    });

    it('should render <BuildControls/> when receiving ingredients', () => {
    //dostarczam niezbędne propsy do wrappera (patrz Burgerbuilder), żeby buildControls się utworzyło
        wrapper.setProps({ingr: {meat: 0}});
        expect(wrapper.find(BuildControls)).tohaveLength(1);
    });
});