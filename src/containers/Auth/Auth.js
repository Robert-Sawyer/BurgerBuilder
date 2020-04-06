import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index'

const auth = props => {

    const [authForm, setAuthForm] = useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Wpisz adres E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Wpisz hasło'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        });
    const [isSignUp, setIsSignUp] = useState(true);

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
    useEffect(() => {
        //robimy dispatcha dla ustawienia śćieżki przekierowania również gdy user nie zbudował burgera
        //wykorzystuję do tego parametr building ze state w reducers/burgerBuilder
        if (!buildingBurger && authRedirectPath !== "/") {
            onSetAuthRedirectPath();
            //oto co się dzieje: jeśli user nie zbudował burgera I jeśli ścieżka przekierowania nie kieruje na główną,
            //wtedy wywołaj metodę z dispatcha bo tam jest na sztywno '/'. robię tu resetowanie ścieżki na domyślną
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const checkValidity = (value, rules) => {
        let isValid = true;

        if (!rules) {
            return true;
        }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid;
        };

    const inputChangedHandler = (event, inputName) => {
        const updatedForm = {
            ...authForm,
            [inputName]: {
                ...authForm[inputName],
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[inputName].validation),
                touched:true
            }
         };
        setAuthForm(updatedForm);
    };

    const submitHandler = (event) => {
        //to zapobiega przeładowywaniu sie strony
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    };

    //ta metoda zmienia metodę autoryzacji, tzn jeśli jest zarejestrowany to zmienia treść buttona na zaloguj,
    //natomiast gdy nie jest to wtedy wyświetla się zarejestruj - reszta logiki na dole w Button
    //trzeba jeszcze zmienić link do obu Buttonów w zależności od rodzaju autoryzacji - logika i komentarze w action/auth
    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    };

        const formElementsArray = [];
        for (let key in authForm) {
            formElementsArray.push({
                    id: key,
                    config: authForm[key]
                }
            );
        }

        //zmieniam const na let bo będziemy modyfikować form w zależności czy loading jest true czy false
        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => inputChangedHandler(event, formElement.id)}
            />
        ));

        if (props.loading) {
            form = <Spinner/>
        }

        let errorMessage = null;
        if (props.error) {
            errorMessage = (
                <p>{props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (props.isAuthenticated) {
        //uzależniam ścieżkę od tego, jaka jest aktualnie ustawiona w state w reducerze a to zależy
        //od wartości parametru buildingBurger
            authRedirect = <Redirect to={props.authRedirectPath}/>
        }

        return (
        // onAuth ma się uruchamiać po każdym wysłaniu formularza (onSubmitHandler)
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={submitHandler}>
                    {form}
                    <Button btnType="Success">ZATWIERDŹ</Button>
                </form>
                <Button
                    clicked={switchAuthModeHandler}
                    btnType='Danger'>PRZEŁĄCZ NA {isSignUp ? 'LOGOWANIE' : 'REJESTRACJĘ'}</Button>
            </div>
        );
};

const mapStateToProps = state => {
    return {
    //state.auth a dokładniejsamo auth bierze się z index.js gdzie mam zdefiniowane reducery po konkretnymi nazwami
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        //w tym przypadku ustawiamy na sztywno ścieżkę, bo poprzez Auth container zawsze chcemy przekirować na główną
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);