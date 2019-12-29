import React, { Component } from 'react';
import '../css/Confirmation.scss';
import config from '../config.json'
class Confirmation extends Component {
    state = {
        firstName: '',
        surname: '',
        confirmed: false,
        _id: '',

        companionId: '',
        companionFirstName: '',
        companionSurname: '',
        companionConfirmed: false,

        companionFirstNameInBase: '', //these fields will be used to check, if companions' name was changed by user and possibly execute a certain API query
        companionSurnameInBase: '',

        token: '',

        nameError: false,
        surnameError: false,
        companionError: false,
        tokenError: false,

        noCompanion: true //disables the fields of the form, that accord to the companion
    }
    isValid = target => {
        if (target.type === "text" || target.tagName === "TEXTAREA") {
            if (target.classList.contains('name')) {
                if (target.value.length <= 30) {
                    const regEx = /^[a-zęóąśłżźćń ]*$/i;
                    if (regEx.test(target.value)) {
                        return true;
                    }
                    else {
                        this.props.setErrorPrompt('W tym polu można używać jedynie liter i spacji');
                    }
                    return false;
                }
                else {
                    this.props.setErrorPrompt('Długość tekstu w tym polu nie może przekraczać 30 znaków');
                }
                return false;
            }
            else if (target.id === "token") {
                const regEx = /^[a-zęóąśłżźćń0-9]{0,6}$/i;
                if (regEx.test(target.value)) {
                    return true;
                }
                else {
                    this.props.setErrorPrompt('Token składa się wyłącznie z cyfr i liter (6 znaków)');
                }
                return false;
            }
        }
        else if (target.type === "radio") {
            if (target.value === "true" || target.value === "false") {
                return true;
            }
            return false;
        }
        return true;
    }
    changeHandler = e => {
        if (this.isValid(e.target)) {
            const newState = {}
            if (e.target.type === "radio") {
                let value = null;
                if (e.target.value === "true") {
                    value = true;
                }
                else {
                    value = false;
                }
                newState[e.target.name] = value;
                this.setState(newState);
            }
            else {
                newState[e.target.id] = e.target.value;
                newState[`${e.target.id}Error`] = false;

                this.setState(newState);
            }
        }
    }
    fetchCompanionData = () => {
        const { firstName, surname, token, nameError, surnameError, tokenError } = this.state;
        if (firstName !== '' && surname !== '' && token !== '' && !nameError && !surnameError && !tokenError) {
            fetch(`${config.apiUrl}/api/guests/by-name`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ firstName, surname, token }),
                    method: 'POST'
                }
            ).then(resp => resp.json())
                .then(guest => {
                    if (guest.error) {
                        throw new Error(guest.error);
                    }
                    else {
                        this.setState({ confirmed: guest.confirmed, _id: guest._id, companionId: guest.companionId });
                        if (guest.companionId !== "" && guest.companionId !== undefined && guest.companionId !== null) {
                            fetch(`${config.apiUrl}/api/guests/${guest.companionId}`, {
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ token }),
                                method: 'POST'
                            })
                                .then(resp => resp.json())
                                .then(companion => {
                                    if (companion.error) {
                                        throw new Error(companion.error);
                                    }
                                    else {
                                        this.setState({
                                            companionFirstName: companion.firstName,
                                            companionSurname: companion.surname,
                                            companionConfirmed: companion.confirmed,

                                            companionFirstNameInBase: companion.firstName,
                                            companionSurnameInBase: companion.surname,

                                            noCompanion: false
                                        })
                                    }
                                })
                                .catch(err => {
                                    this.props.setErrorPrompt(err.message);
                                })
                        }
                        else {
                            this.setState({ companionFirstName: '', companionSurname: '', companionConfirmed: false, noCompanion: true });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.props.setErrorPrompt(err.message);
                });
        }
    }
    formSubmit = e => {
        e.preventDefault();

        let isThereAnError = false;
        if (!/^[a-zęóąśłżźćń]{3,}$/ig.test(this.state.name)) {
            this.setState({ nameError: true });
            isThereAnError = true;

        }
        if (!/^[a-zęóąśłżźćń]{2,}$/i.test(this.state.surname)) {
            this.setState({ surnameError: true });
            isThereAnError = true;
        }
        if (!/^[a-zęóąśłżźćń ]{2,}$/i.test(this.state.companion)) {
            this.setState({ companionError: true });
            isThereAnError = true;
        }
        if (!/^[a-z0-9]{6}$/i.test(this.state.token)) {
            this.setState({ tokenError: true });
            isThereAnError = true;
        }
        if (this.state.confirmed !== true && this.state.confirmed !== false) {
            isThereAnError = true;
        }

        if (this.state.companionConfirmed !== true && this.state.companionConfirmed !== false) {
            isThereAnError = true;
        }
        if (!isThereAnError) {
            this.sendToAPI();
        }
        else {
            this.props.setErrorPrompt("Formularz nie został wypełniony prawidłowo.");
        }
    }
    formReset = e => {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            firstName: '',
            surname: '',
            confirmed: false,
            _id: '',

            companionId: '',
            companionFirstName: '',
            companionSurname: '',
            companionConfirmed: false,

            companionFirstNameInBase: '',
            companionSurnameInBase: '',

            token: '',

            nameError: false,
            surnameError: false,
            companionError: false,
            tokenError: false,

            noCompanion: true
        });
    }
    sendToAPI = () => {
        const { companionFirstName, companionSurname, companionFirstNameInBase, companionSurnameInBase } = this.state;

        if (companionFirstName !== companionFirstNameInBase || companionSurname !== companionSurnameInBase) {
            //if companion's first or surname changed - execute the certain API Query
            this.changeCompanionName();
        }
        else {
            //this.confirm() will be executed by this.changeCompanionName in case of companion's name change
            this.confirm();
        }
    }
    changeCompanionName = () => {
        const { _id, companionFirstName, companionSurname, token } = this.state;

        fetch(`${config.apiUrl}/api/guests/${_id}/change-companion-name`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: companionFirstName,
                    surname: companionSurname,
                    token
                }),
                method: 'PUT'
            })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.confirm()
                }
            })
            .catch(err => {
                this.props.setErrorPrompt(err.message);
            })
    }

    confirm = () => {
        const {
            _id,
            companionId,
            confirmed,
            companionConfirmed,
            token
        } = this.state;

        //First - confirm the main guest
        fetch(`${config.apiUrl}/api/guests/${_id}/confirm`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token, confirmed
                }),
                method: 'PUT'
            })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    fetch(`${config.apiUrl}/api/guests/${companionId}/confirm`,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                token, confirmed: companionConfirmed
                            }),
                            method: 'PUT'
                        })
                        .then(resp => resp.json())
                        .then(resp => {
                            if (resp.error) {
                                throw new Error(resp.error);
                            }
                            else {
                                this.props.setErrorPrompt('Udało się!')
                                this.formReset();
                            }
                        })
                        .catch(err => {
                            this.props.setErrorPrompt(err.message);
                        })
                }
            })
            .catch(err => {
                this.props.setErrorPrompt(err.message);
            })

    }

    render() {
        const { firstName, surname, companionFirstName, companionSurname, companionConfirmed, message, token, noCompanion } = this.state;
        return (
            <div className="slider-container">
                <h3 className="confirmation-h3">Potwierdź przybycie</h3>
                <p>
                    Aby zweryfikować tożsamość, w polu <i>token</i>, należy wprowadzić kod dołączony do zaproszenia.
                </p>
                <form onSubmit={e => e.preventDefault()} className="confirmation-form" autoComplete="off">

                    <label htmlFor="firstName">Imię</label>
                    <input onBlur={this.fetchCompanionData} onChange={this.changeHandler} type="text" id="firstName" className={`name ${this.state.nameError === true ? "input-error" : null}`} value={firstName} />

                    <label htmlFor="surname">Nazwisko</label>
                    <input onBlur={this.fetchCompanionData} onChange={this.changeHandler} type="text" id="surname" className={`name ${this.state.surnameError ? "input-error" : null}`} value={surname} />

                    <label htmlFor="token">Token</label>
                    <input onBlur={this.fetchCompanionData} className={this.state.tokenError ? "input-error" : null} onChange={this.changeHandler} type="text" id="token" value={token} />

                    <p>Czy przybędziesz na wesele?</p>
                    <div>
                        <label className="radio-label">
                            <input onChange={this.changeHandler} type="radio" name="confirmed" value={true} checked={this.state.confirmed} />
                            Tak
                        </label>
                        <label>
                            <input onChange={this.changeHandler} type="radio" name="confirmed" value={false} checked={!this.state.confirmed} />
                            Nie
                        </label>
                    </div>

                    <label htmlFor="companionFirstName">Imię os. towarzyszącej</label>
                    <input disabled={noCompanion} onChange={this.changeHandler} type="text" id="companionFirstName" className={`name ${this.state.companionFirstNameError ? "input-error" : null}`} value={companionFirstName} />

                    <label htmlFor="companionSurname">Nazwisko os. towarzyszącej</label>
                    <input disabled={noCompanion} onChange={this.changeHandler} type="text" id="companionSurname" className={`name ${this.state.companionFirstNameError ? "input-error" : null}`} value={companionSurname} />

                    <p>Czy osoba towarzysząca przybędzie na wesele?</p>
                    <div>
                        <label className="radio-label">
                            <input disabled={noCompanion} onChange={this.changeHandler} type="radio" name="companionConfirmed" value={true} checked={companionConfirmed} />
                            Tak
                        </label>
                        <label>
                            <input disabled={noCompanion} onChange={this.changeHandler} type="radio" name="companionConfirmed" value={false} checked={!companionConfirmed} />
                            Nie
                        </label>
                    </div>

                    <button onClick={this.formSubmit}>Wyślij</button>
                    <button onClick={this.formReset}>Reset</button>
                </form>
            </div>
        );
    }
}

export default Confirmation;
