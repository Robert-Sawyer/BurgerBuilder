import React, {useState, useEffect} from 'react';
import Aux from '../AuxComponent/AuxComponent';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {

        const [error, setError] = useState(null);

        const reqInterceptor = axios.interceptors.request.use(req => {
            setError(null);
            return req;
        });
        //Powyżej - przez oczekiwaniem odpowiedzi o ewentualnym błędzie resetujemy obiekt error, żeby dostać w aktualną
        // informację w response poniżej
        const resInterceptor = axios.interceptors.response.use(res => res, err => {
            setError(err);
            //Powyżęj - pierwszy error to ten ze state, domyślnie ustawiony jako null ponieważ normalnie nie powinno być
            //błędu. drugi error to argument: błąd przesłany z firebase (lub innej bazy danych). W efekcie nasz programowy
            //łapacz błędów stworzony w state wyłapuje ewentualny błąd przesłany nam z zewnątrz.
            //res => res - to skrócona forma returna (patrz na req wyżej)
        });

        //usuwam interceptory w celu zwolnienia miejsca w pamięci
        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(reqInterceptor);
                axios.interceptors.response.eject(resInterceptor);
            };
            //za każdym razem, gdy zmieni się req lub resInterceptor komponent zrenderuje się ponownie i wyczyści interceptory
        }, [reqInterceptor, resInterceptor]);

        const errorConfirmedHandler = () => {
            setError(null);
        };

        return (
            <Aux>
                <Modal
                    show={error}
                    modalClosed={errorConfirmedHandler}>
                    {/*Po kliknięciu w tło Modal - Backdrop zamknij go resetując obiekt error.*/}
                    {error ? error.message : null}
                    {/*Jeżeli występuje błąd to wyświetl go zamiast Modal, jeśli go nie ma nic nie rób (null)*/}
                </Modal>
                <WrappedComponent {...props}/>
            </Aux>
        );
    }
};

export default withErrorHandler;