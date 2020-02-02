import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
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
                    placeholder: 'Your Mail'
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
                    placeholder: 'Street'
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
                    placeholder: 'Zip Code'
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
                    placeholder: 'City'
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
                        {value: '', displayValue:'select'},
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: '',
                validation: {},
                valid: false
            }
        },
        formIsValid: false,
        loading: false
    };

    //event.preventDefault zapobiega przeładowaniu sie strony przy zamówieniu
    orderHandler = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        //tworzymy pusty obiekt, do którego wrzucimy dane uzytkownika
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            //rozpoznajemy rodzaj inputa i wrzucamy tam wartość wprowadzona przez usera
            // (TYLKO WARTOŚĆ, config i type nas nie interesują), po czym dodajemy stała formData do stałej order poniżej
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ingr,
            price: this.props.price,
            customerData: formData
        };
        axios.post('orders.json', order)
            .then(response => {
                this.setState({
                    loading: false
                });
                //dzieki temu po złożeniu zamówienia przekieruje nas z powrotem do głównej
                //strony (reszta w checkout - props w Route -> render)
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({
                    loading: false
                })
            });
        console.log(this.props.ingredients);
    };

    checkValidity(value, rules) {
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

        return isValid;
    }

    //inputIdentifier to parametr po którym metoda rozpozna o który input chodzi. PONIŻEJ do metody przesyłamy formElement.id, co
    //jest unikalną nazwą tego inputa (pętla w render()).
    inputChangedHandler = (event, inputIdentifier) => {
        // console.log(event.target.value);

        //robimy klon obiektu orderForm (za pomocą ...)
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //tworzymy stałą pomocniczą, żeby zidentyfikować konkretny input w obiekcie orderForm (za pomocą inputIndentifier)
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        //chcemy pobrać wartośc od użytkownika (wpisywany w inpucie tekst) i podstawiamy go w stałej pomocniczej w value
        //(stała pomocnicza updatedFormElement jest klonem orderForm, więc posiada te same składowe, w tym value)
        updatedFormElement.value = event.target.value;

        //tutaj ustawiamy walidację, czy pola zostały poprawnie wypełnione - sprawdzi to metoda checkvalidity
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
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
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                }
            );
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data:</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingr: state.ingredients,
        price: state.totalPrice
    }
};

export default connect(mapStateToProps)(ContactData);