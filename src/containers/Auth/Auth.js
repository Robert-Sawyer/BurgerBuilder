import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index'

class Auth extends Component {

    state = {
        authForm: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Mail'
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
                    placeholder: 'Your Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    }

    checkValidity(value, rules) {
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
        }

    inputChangedHandler = (event, inputName) => {
        const updatedForm = {
            ...this.state.authForm,
            [inputName]: {
                ...this.state.authForm[inputName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.authForm[inputName].validation),
                touched:true
            }
         };
         this.setState({authForm: updatedForm});
    }

    submitHandler = (event) => {
        //to zapobiega przeładowywaniu sie strony
        event.preventDefault();
        this.props.onAuth(this.state.authForm.email.value, this.state.authForm.password.value, this.state.isSignUp);
    }

    //ta metoda zmienia metodę autoryzacji, tzn jeśli jest zarejestrowany to zmienia treść buttona na zaloguj,
    //natomiast gdy nie jest to wtedy wyświetla się zarejestruj - reszta logiki na dole w Button
    //trzeba jeszcze zmienić link do obu Buttonów w zależności od rodzaju autoryzacji - logika i komentarze w action/auth
    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp};
        });
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.authForm) {
            formElementsArray.push({
                    id: key,
                    config: this.state.authForm[key]
                }
            );
        }

        const form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));

        return (
        // onAuth ma się uruchamiać po każdym wysłaniu formularza (onSubmitHandler)
            <div className={classes.Auth}>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        );
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
    };
};

export default connect(null, mapDispatchToProps)(Auth);