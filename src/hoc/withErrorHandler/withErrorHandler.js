import React, {Component} from 'react';

import Aux from '../AuxComponent/AuxComponent';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error: null
        }

        componentWillMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            //Powyżej - przez oczekiwaniem odpowiedzi o ewentualnym błędzie resetujemy obiekt error, żeby dostać w aktualną
            // informację w response poniżej
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
                //Powyżęj - pierwszy error to ten ze state, domyślnie ustawiony jako null ponieważ normalnie nie powinno być
                //błędu. drugi error to argument: błąd przesłany z firebase (lub innej bazy danych). W efekcie nasz programowy
                //łapacz błędów stworzony w state wyłapuje ewentualny błąd przesłany nam z zewnątrz.
                //res => res - to skrócona forma returna (patrz na req wyżej)
            });
        }

        //usuwam interceptory w celu zwolnienia miejsca w pamięci
        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {/*Po kliknięciu w tło Modal - Backdrop zamknij go resetując obiekt error.*/}
                        {this.state.error ? this.state.error.message : null}
                        {/*Jeżeli występuje błąd to wyświetl go zamiast Modal, jeśli go nie ma nic nie rób (null)*/}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </Aux>
            );
        }
    }
};

export default withErrorHandler;