import React, { Component } from 'react';
import config from '../config';
import '../css/Guests.scss';
import { NavLink } from 'react-router-dom';

class Guests extends Component {
    state = {
        guests: [],
        error: '',
        message: '',
        pageNumber: 0,
        recordsPerPage: 5,
        searchQuery: '',
        addGuestForm: {
            firstName: '',
            surname: '',
            companionId: '',
        }
    }
    componentDidMount() {
        this.getGuests();
    }
    getGuests = () => {
        fetch(`${config().apiUrl}/api/guests`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.props.bearer}`
            }
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.setState({ guests: resp });
                }
            })
            .catch(err => {
                this.setState({ error: err.message });
            })
    }
    removeGuest = (id) => {
        fetch(`${config().apiUrl}/api/guests/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${this.props.bearer}`
            }
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.setState({ message: resp.message });
                    this.getGuests();
                }
            })
            .catch(err => {
                this.setState({ error: err.message });
            })
    }
    nameChangeHandler = e => {
        const nameRegex = /^[a-z0-9ęóąśłżźćń ]{0,30}$/i;
        const value = e.target.value;

        if (!nameRegex.test(value)) {
            e.target.classList.add('error');
        }
        else {
            e.target.classList.remove('error');
        }

        if (e.target.id === "firstName") {
            this.setState(prevState => ({
                addGuestForm: {
                    ...prevState.addGuestForm,
                    firstName: value
                }
            }))
        }
        else if (e.target.id === "surname") {
            this.setState(prevState => ({
                addGuestForm: {
                    ...prevState.addGuestForm,
                    surname: value
                }
            }))
        }
    }
    companionChangeHandler = e => {
        const value = e.target.value;
        this.setState(prevState => ({
            addGuestForm: {
                ...prevState.addGuestForm,
                companionId: value
            }
        }))
    }
    verifyForm = e => {
        e.preventDefault();
        const { firstName, surname, companionId } = this.state.addGuestForm;
        if (typeof firstName === "string" && firstName !== "" && typeof surname === "string" && surname !== "") {
            const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
            if (nameRegex.test(firstName) && nameRegex.test(surname)) {
                if (typeof companionId === "string" && companionId === "") {
                    //No companion - OK
                    this.submitForm();
                }
                else if (typeof companionId === "string" && companionId !== "") {
                    //There is a companion
                    const companionIdRegex = /^[a-z0-9]{24}$/i;
                    if (companionIdRegex.test(companionId)) {
                        this.submitForm();
                    }
                    else {
                        this.setState({ error: 'Nieprawidłowe id osoby towarzyszącej', message: '' });
                    }
                }
                else {
                    this.setState({ error: 'Nieprawidłowe id osoby towarzyszącej', message: '' });
                }

            }
            else {
                this.setState({ error: 'Nieprawidłowe imię lub nazwisko.', message: '' })
            }
        }
        else {
            this.setState({ error: 'Należy podać imię i nazwisko gościa.', message: '' })
        }
    }
    submitForm = () => {
        const { firstName, surname, companionId } = this.state.addGuestForm;
        fetch(`${config().apiUrl}/api/guests`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${this.props.bearer}`,
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
                    this.setState({
                        message: resp.message,
                        addGuestForm: {
                            firstName: '',
                            surname: '',
                            companionId: '',
                        }
                    });
                    this.getGuests();
                }
            })
            .catch(err => {
                this.setState({ error: err.message });
            })

    }
    switchPages = e => {
        const { recordsPerPage, guests } = this.state;
        const pageNumber = parseInt(e.target.value);
        if (pageNumber >= 0 && pageNumber <= Math.ceil(guests.length / recordsPerPage)) {
            this.setState({ pageNumber });
        }
    }
    paginationInputHandler = e => {
        const { guests, pageNumber } = this.state;
        const recordsPerPage = parseInt(e.target.value);
        if (recordsPerPage >= 0 && recordsPerPage <= guests.length) {
            if (pageNumber * recordsPerPage < guests.length) {
                this.setState({ recordsPerPage });
            }
        }
        else {
            this.setState({ recordsPerPage: 5 });
        }
    }
    searchHandler = e => {
        const regex = /^[a-zęóąśłżźćń ]{0,30}$/i;
        const searchQuery = e.target.value;
        if (typeof searchQuery === "string" && regex.test(searchQuery)) {
            this.setState({ searchQuery, pageNumber: 0 });
        }
    }
    render() {
        const { guests, pageNumber, recordsPerPage, searchQuery } = this.state;
        let guestsFiltered = [];
        if (searchQuery !== "") {
            guestsFiltered = guests.filter(guest => {
                const nameSurname = `${guest.firstName.toLowerCase()} ${guest.surname.toLowerCase()}`;
                const surnameName = `${guest.surname.toLowerCase()} ${guest.firstName.toLowerCase()}`;

                if (nameSurname.indexOf(searchQuery.toLowerCase()) !== -1) {
                    return true;
                }
                else if (surnameName.indexOf(searchQuery.toLowerCase()) !== -1) {
                    return true;
                }
                return false;
            });
        }
        else {
            guestsFiltered = guests;
        }
        const guestsToDisplay = guestsFiltered.slice(pageNumber * recordsPerPage, pageNumber * recordsPerPage + recordsPerPage);
        let numberOfPages = guestsFiltered.length / recordsPerPage;
        const buttons = [];
        for (let i = 0; i < numberOfPages; i++) {
            if (i === pageNumber) {
                //active page
                buttons[i] = <button key={i} onClick={this.switchPages} className="pagination-button pagination-button-active" value={i}>{i + 1}</button>;
            }
            else {
                buttons[i] = <button key={i} onClick={this.switchPages} className="pagination-button" value={i}>{i + 1}</button>;
            }
        }
        return (
            <div className="guests-container">
                <>
                    <h2>Lista gości</h2>
                    {this.state.message !== "" ? <h3 className="message-prompt">{this.state.message}</h3> : null}
                    {this.state.error !== "" ? <h3 className="error-prompt">{this.state.error}</h3> : null}
                    <input type="search" onChange={this.searchHandler} value={this.state.searchQuery} />
                    {guestsToDisplay.length !== 0 ?
                        <table className="guests-table">
                            <thead>
                                <tr>
                                    <td className="hideOnMobile">Nr</td>
                                    <td className="center">Gość</td>
                                    <td className="center">Przybędzie?</td>
                                    <td className="center hideOnMobile">Osoba towarzysząca</td>
                                    <td className="center">Token</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    guestsToDisplay.map((guest, key) => {
                                        //Check if guest is confirmed
                                        let confirmed = "Brak potw.";
                                        if (guest.confirmed === true) {
                                            confirmed = "Tak";
                                        }
                                        else if (guest.confirmed === false) {
                                            confirmed = "Nie";
                                        }

                                        //Get companion name
                                        let companionName = "Brak"
                                        if (typeof guest.companionId === "string" && guest.companionId !== "") {
                                            const companion = this.state.guests.find(companion => {
                                                if (companion._id === guest.companionId) {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }
                                            });
                                            if (typeof companion !== "undefined") {
                                                companionName = `${companion.firstName} ${companion.surname}`;
                                            }
                                            else {
                                                companionName = "Błąd";
                                            }
                                        }
                                        return (
                                            <tr key={key}>
                                                <td className="hideOnMobile">{key + 1}.</td>
                                                <td>{guest.firstName} {guest.surname}</td>
                                                <td className="center">{confirmed}</td>
                                                <td className="hideOnMobile">{companionName}</td>
                                                <td>{guest.token}</td>
                                                <td className="operations-cell">
                                                    <NavLink className="edit-button" to={`/guests/edit/${guest._id}?bearer=${this.props.bearer}`}></NavLink>
                                                    <button className="remove-button" onClick={this.removeGuest.bind(this.removeGuest, guest._id)}></button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table> : <h3 className="error-prompt">Brak gości do wyświetlenia</h3>}
                    <div className="pagination-container">
                        {
                            guestsFiltered.length > guestsToDisplay.length ? buttons : null
                        }
                        <p>Wyświetl po:
                            </p>
                        <input type="number" className="pagination-input" min="1" max={guests.length} onChange={this.paginationInputHandler} value={recordsPerPage} /> gości.
                        </div>
                </>
                <form autoComplete="off" className="addGuest-form">
                    <h2>Dodaj gościa</h2>
                    <label htmlFor="firstName">Imię</label>
                    <input id="firstName" type="text" value={this.state.addGuestForm.firstName} onChange={this.nameChangeHandler} />
                    <label htmlFor="surname">Nazwisko</label>
                    <input id="surname" type="text" value={this.state.addGuestForm.surname} onChange={this.nameChangeHandler} />
                    <label htmlFor="companion">Osoba towarzysząca</label>
                    <select id="companion" value={this.state.addGuestForm.companionId} onChange={this.companionChangeHandler}>
                        <option value="">Brak</option>
                        {this.state.guests.map((guest, key) => {
                            return (
                                <option key={key} value={guest._id}>{`${guest.firstName} ${guest.surname}`}</option>
                            );
                        })}
                    </select>
                    <button onClick={this.verifyForm}>Dodaj</button>
                </form>
            </div>
        );
    }
}
export default Guests;