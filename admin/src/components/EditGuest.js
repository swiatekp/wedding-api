import React, { Component } from 'react';
import config from '../config';
import '../css/EditGuest.scss';
import { NavLink } from 'react-router-dom';

class EditGuest extends Component {
    state = {
        error: '',
        message: '',
        editedGuest: {
            firstName: '',
            surname: '',
            companionId: '',
            confirmed: '',
            message: ''
        },
        otherGuests: []
    }
    nameRegex = /^[a-z0-9ęóąśłżźćń ]{0,30}$/i;
    componentDidMount() {
        this.guestId = this.props.match.params.id;
        this.getGuests();
    }
    componentDidUpdate() {
        if (this.guestId !== this.props.match.params.id) {
            //When params.id changes, getGuests. ComponentWillReceiveProps is unsafe
            this.guestId = this.props.match.params.id;
            //get guests relies on this.guestId. Make sure it is up to date before use.
            this.getGuests();
        }
    }
    getGuests = () => {
        fetch(`${config().apiUrl}/api/guests/`, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    const editedGuest = resp.find(guest => {
                        if (guest._id === this.guestId) {
                            return true;
                        }
                        return false;
                    });
                    if (typeof editedGuest === "undefined") {
                        throw new Error("Nie znaleziono gościa o podanym ID");
                    }

                    const otherGuests = resp.filter(guest => {
                        if (guest._id !== this.guestId) { return true }
                        else { return false };
                    })
                    this.prevGuest = editedGuest;
                    this.setState({
                        editedGuest, otherGuests
                    });
                }
            })
            .catch(err => {
                this.setState({ error: err.message, message: '' });
            });
    }
    clearPrompts = () => {
        window.setTimeout(() => this.setState({ message: '', error: '' }), 7000)
    }
    firstNameChangeHandler = e => {
        const value = e.target.value;
        if (this.nameRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }

        this.setState(prevState => ({
            ...prevState,
            editedGuest: {
                ...prevState.editedGuest,
                firstName: value
            }
        }));
    }
    surnameChangeHandler = e => {
        const value = e.target.value;
        if (this.nameRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }

        this.setState(prevState => ({
            ...prevState,
            editedGuest: {
                ...prevState.editedGuest,
                surname: value
            }
        }));
    }
    confirmedChangeHandler = e => {
        let value = "";
        if (e.target.value === "true") {
            value = true;
        }
        else if (e.target.value === "false") {
            value = false;
        }

        console.log(value);
        console.log(this.state.editedGuest.confirmed);
        this.setState(prevState => ({
            ...prevState,
            editedGuest: {
                ...prevState.editedGuest,
                confirmed: value
            }
        }));
    }
    companionChangeHandler = e => {
        const value = e.target.value;

        this.setState(prevState => ({
            ...prevState,
            editedGuest: {
                ...prevState.editedGuest,
                companionId: value
            }
        }));
    }
    resetForm = e => {
        e.preventDefault();
        this.setState(prevState => ({
            ...prevState,
            editedGuest: this.prevGuest
        }));
    }
    submitForm = e => {
        e.preventDefault();
        let { firstName, surname, companionId, confirmed } = this.state.editedGuest;
        if (companionId === this.prevGuest.companionId) {
            //If the companion Id won't change - set it to undefined, so API won't change it too.
            companionId = undefined;
        }
        if (typeof firstName === "string" && typeof surname === "string") {
            const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
            if (nameRegex.test(firstName) && nameRegex.test(surname)) {
                const idRegex = /^[a-z0-9]{24}$/i;
                if ((typeof companionId === "string" && idRegex.test(companionId)) || companionId === null || companionId === undefined || companionId === "") {
                    fetch(`${config().apiUrl}/api/guests/${this.guestId}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ firstName, surname, companionId })
                    })
                        .then(resp => resp.json())
                        .then(resp => {
                            if (resp.error) {
                                throw new Error(resp.error);
                            }
                            else {
                                //Confirmation of guests' arrival - check if neccessary
                                if (confirmed !== this.prevGuest.confirmed) {
                                    if (typeof confirmed === "boolean" || confirmed === "") {
                                        fetch(`${config().apiUrl}/api/guests/${this.guestId}/confirm`, {
                                            method: 'PUT',
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({ confirmed })
                                        })
                                            .then(resp => resp.json())
                                            .then(resp => {
                                                if (resp.error) {
                                                    throw new Error(resp.error);
                                                }
                                                else {
                                                    this.setState({ error: '', message: 'Operacja wykonana pomyślnie' });
                                                    this.clearPrompts();
                                                }
                                            })
                                            .catch(err => {
                                                this.setState({ error: err.message, message: '' });
                                            });
                                    }
                                }
                                else {
                                    this.setState({ error: '', message: 'Operacja wykonana pomyślnie' });
                                    this.clearPrompts();
                                }
                            }
                        })
                        .catch(err => {
                            this.setState({ error: err.message, message: '' });
                        });
                }
                else {
                    this.setState({ error: 'Nieprawidłowe ID osoby towarzyszącej', message: '' });
                }
            }
            else {
                this.setState({ error: 'Nieprawidłowe imię lub nazwisko', message: '' });
            }
        }
        else {
            this.setState({ error: 'Należy podać imię i nazwisko', message: '' });
        }

    }
    render() {

        const { _id, firstName, surname, confirmed, companionId } = this.state.editedGuest;

        const otherGuests = this.state.otherGuests.map(guest => {
            return (<option key={guest._id} value={guest._id}>{`${guest.firstName} ${guest.surname}`}</option>)
        })
        return (
            <div className="edit-guest-container">
                <p className="localization"><NavLink to={`/guests`}>Zarządzanie gośćmi</NavLink> > <NavLink to={`/guests/edit/${_id}`}>{`${firstName} ${surname}`}</NavLink></p>
                <h2>Edycja gościa</h2>
                {this.state.error === "" ? null : <h3 className="error-prompt">{this.state.error}</h3>}
                {this.state.message === "" ? null : <h3 className="message-prompt">{this.state.message}</h3>}

                <form className="edit-guest-form">
                    <label htmlFor="firstName">Imię</label>
                    <input id="firstName" onChange={this.firstNameChangeHandler} value={firstName} />
                    <label htmlFor="surname">Nazwisko</label>
                    <input id="surname" onChange={this.surnameChangeHandler} value={surname} />
                    <label htmlFor="confirmed">Potwierdzenie przybycia</label>
                    <select id="confirmed" onChange={this.confirmedChangeHandler} value={confirmed}>
                        <option value="">Brak potwierdzenia</option>
                        <option value={true}>Przybędzie</option>
                        <option value={false}>Nie przybędzie</option>
                    </select>
                    <label htmlFor="companion">Osoba towarzysząca</label>
                    <select id="companion" onChange={this.companionChangeHandler} value={companionId}>
                        <option value="">Bez osoby towarzyszącej</option>
                        {otherGuests}
                    </select>
                    <button onClick={this.submitForm}>Zatwierdź</button>
                    <button onClick={this.resetForm}>Reset</button>
                </form>
                {companionId !== "" ? <NavLink className="companion-link" to={`/guests/edit/${companionId}`}>Przejdź do osoby towarzyszącej</NavLink> : null}
            </div>
        );
    }
}

export default EditGuest;