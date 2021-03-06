import React, {useState} from 'react';
import {connect} from 'react-redux';
import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

const contactData = props => {

    const [orderForm, setOrderForm] = useState({
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Imię'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Adres E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Ulica'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Kod pocztowy'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 6
                },
                valid: false,
                touched: false
            },
            city: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Miasto'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: '', displayValue:'wybierz metodę dostawy'},
                        {value: 'fastest', displayValue: 'Najszybsza'},
                        {value: 'cheapest', displayValue: 'Najtańsza'}
                    ]
                },
                value: '',
                validation: {},
                valid: false
            }
        });
        const [formIsValid, setFormIsValid] = useState(false);

    //event.preventDefault zapobiega przeładowaniu sie strony przy zamówieniu
    const orderHandler = (event) => {
        event.preventDefault();

        //tworzymy pusty obiekt, do którego wrzucimy dane uzytkownika
        const formData = {};
        for (let formElementIdentifier in orderForm) {
            //rozpoznajemy rodzaj inputa i wrzucamy tam wartość wprowadzona przez usera
            // (TYLKO WARTOŚĆ, config i type nas nie interesują), po czym dodajemy stała formData do stałej order poniżej
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: props.ingr,
            price: props.price,
            customerData: formData,
            userId: props.userId
        };

        props.onOrderBurger(order, props.token);
    };

    const checkValidity = (value, rules) => {
        let isValid = true;
        //to jeśli jakieś pole nie ma wymagalności, np deliveryMethod, wtedy mówi, że jest poprawnie
        if (!rules) {
            return true;
        }
        if (rules.required) {
            //drugi warunek jest po to, żeby przy ostatnim ifie sprawdzało, czy poprzednie też zopstały spełnione,
            //czyli ten warunek wymaga poprawnośc wszystkich pól
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

    //inputIdentifier to parametr po którym metoda rozpozna o który input chodzi. PONIŻEJ do metody przesyłamy formElement.id, co
    //jest unikalną nazwą tego inputa (pętla w render()).
    const inputChangedHandler = (event, inputIdentifier) => {
        // console.log(event.target.value);

        //robimy klon obiektu orderForm (za pomocą ...)
        const updatedOrderForm = {
            ...orderForm
        };
        //tworzymy stałą pomocniczą, żeby zidentyfikować konkretny input w obiekcie orderForm (za pomocą inputIndentifier)
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        //chcemy pobrać wartośc od użytkownika (wpisywany w inpucie tekst) i podstawiamy go w stałej pomocniczej w value
        //(stała pomocnicza updatedFormElement jest klonem orderForm, więc posiada te same składowe, w tym value)
        updatedFormElement.value = event.target.value;

        //tutaj ustawiamy walidację, czy pola zostały poprawnie wypełnione - sprawdzi to metoda checkvalidity
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        console.log(updatedFormElement);

        //ustawiamy ten parametr gdy użytkownik kliknie na pole i wtedy dopiero pokazuje walidację poprzez podświetlenie
        updatedFormElement.touched = true;

        //identyfikujemy konkretnego inputa w klonie orderForm i zamieniamy jego zawartość zawartościa stałej pomocniczej
        //updatedFormElement, a konkretnie value (pozostałe składowe sa bez zmian ponieważ są klonami orderForm a
        //zmienialiśmy tylko value
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        //ustawiamy lokalna zmienną pomocniczą do sprawdzenia poprawności WSZYSTKICH pól formularza, czyli ogólna walidacja
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        //ustawiamy state na nowo, z danymi podanymi w formularzu przez użutkownika, oraz info że cały formularz jest ok
        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    };

        const formElementsArray = [];
        for (let key in orderForm) {
            formElementsArray.push({
                    id: key,
                    config: orderForm[key]
                }
            );
        }
        let form = (
            <form onSubmit={orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => inputChangedHandler(event, formElement.id)}/>
                ))}
                <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
            </form>
        );
        if (props.loading) {
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Wprowadź swoje dane kontaktowe:</h4>
                {form}
            </div>
        );
};

const mapStateToProps = state => {
    return {
        ingr: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));