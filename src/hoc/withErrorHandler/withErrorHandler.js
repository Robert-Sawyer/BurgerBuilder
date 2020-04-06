import React from 'react';
import Aux from '../AuxComponent/AuxComponent';
import Modal from '../../components/UI/Modal/Modal';
import useAxiosErrorHandler from '../../hooks/axios-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {

        const [error, clearError] = useAxiosErrorHandler(axios);
        return (
            <Aux>
                <Modal
                    show={error}
                    modalClosed={clearError}>
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