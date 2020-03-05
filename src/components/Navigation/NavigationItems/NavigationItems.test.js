import React from 'react';

import (configure, shallow) from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from '.NavigationItem/NavigationItem';

//istotą enzme jest to, że żeby wytestować jeden komponent, jak navigationitems bez renderowania całej aplikacji możemy
//wyrenderować pojedynczy komponent w izolacji od reszty aplikacji
configure({adapter: new Adapter()}); //teraz mam już konfigurację

//metoda testowa z pakietu 'jest', przyjmuje dwa argumenty - jeden to nazwa testowanego elementu adrugi to funkcja będąca faktycznym testem
describe('<NavigationItems/>', () => {
    let wrapper;
    beforeEach(() => {
        //za pomocą metody shallow renderuję NavigationItems - musi być w JSX i dlatego importuje też samego reacta
        wrapper = shallow(<NavigationItems/>);
    });

    //w it zawiera się opis oczekiwanwgo rezultatu i funkcja testująca
    it('should render two <NavigationItem/> elements if not authenticated', () => {
    //w metodzie beforeEach ustawiam renderowanie NavigationItems i dzieki temu w it() mam już ustawione co trzeba
        //oczekiwane rezultaty - chcę, żeby we wrapperze, do którego wpadł wyrenderowany NavigationItems
        //znalazły się 2 elementy mniejsze, czyli NavigationItem, bo tak powinno się stać, gdy user nie jest zalogoany
        expect(wrapper.find(NavigationItem)).tohaveLength(2);
    });

     it('should render three <NavigationItem/> elements if authenticated', () => {
     //żeby dodać isAuthenticated do wrappera, żeby spełnić warunki testu mam dwa sposoby do tego:
//        const wrapper = shallow(<NavigationItems isAuthenticated/>);
        wrapper.setProps({isAuthenticated: true});
        expect(wrapper.find(NavigationItem)).tohaveLength(3);
    });
});