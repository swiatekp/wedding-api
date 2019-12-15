import React, { Component } from 'react';
import '../css/Page.scss';
import config from '../config';

class Page extends Component {
    state = {
        form: {
            pageTitle: '',
            weddingDate: '',
            brideName: '',
            groomName: '',
            brideMail: '',
            groomMail: '',
            brideTel: '',
            groomTel: '',
            landingpageText: '',
        },
        error: '',
        message: '',
    }
    //Regexes
    pageTitleRegex = /^[a-z0-9ęóąśłżźćń.,-_? ]{2,250}$/i
    nameRegex = /^[a-z0-9ęóąśłżźćń ]{2,30}$/i;
    mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    telRegex = /^[+]{0,1}[0-9 -]{5,30}$/;
    dateRegex = /^20[0-9][0-9]-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]$/

    componentDidMount() {
        fetch(`${config().apiUrl}/page`, { method: 'GET' })
            .then(resp => resp.json())
            .then(resp => {
                //Cut the wedding-date string to let it suit to a datetime-local field
                const { weddingDate } = resp;
                resp.weddingDate = weddingDate.substring(0, 16);
                this.setState({ form: resp });
                this.responseFromApi = resp; //keep the copy out of the state, so the "reset" button can work without fetching the data again
            })
            .catch(err => {
                this.setState({ error: err.toString() });
            })
    }
    //Change handlers
    pageTitleChangeHandler = e => {
        const value = e.target.value;
        if (this.pageTitleRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                pageTitle: value
            }
        }));
    }
    weddingDateChangeHandler = e => {
        const value = e.target.value;
        if (this.dateRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                weddingDate: value
            }
        }));
    }
    landingpageTextChangeHandler = e => {
        const value = e.target.value;
        if (typeof value === "string" && value !== "") {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                landingpageText: value
            }
        }));
    }
    brideNameChangeHandler = e => {
        const value = e.target.value;
        if (this.nameRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                brideName: value
            }
        }));
    }
    brideTelChangeHandler = e => {
        const value = e.target.value;
        if (this.telRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                brideTel: value
            }
        }));
    }
    brideMailChangeHandler = e => {
        const value = e.target.value;
        if (this.mailRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                brideMail: value
            }
        }));
    }
    groomNameChangeHandler = e => {
        const value = e.target.value;
        if (this.nameRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                groomName: value
            }
        }));
    }
    groomTelChangeHandler = e => {
        const value = e.target.value;
        if (this.telRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                groomTel: value
            }
        }));
    }
    groomMailChangeHandler = e => {
        const value = e.target.value;
        if (this.mailRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                groomMail: value
            }
        }));
    }
    resetForm = e => {
        this.setState({ form: this.responseFromApi, error: '' });
        document.querySelectorAll('input, textarea').forEach(input => {
            input.classList.remove('error');
        });
    }
    submitForm = e => {
        const { pageTitle, weddingDate, landingpageText, brideName, brideTel, brideMail, groomName, groomTel, groomMail } = this.state.form;
        if (this.pageTitleRegex.test(pageTitle) &&
            this.dateRegex.test(weddingDate) &&
            typeof landingpageText === "string" && landingpageText !== "" &&
            this.nameRegex.test(brideName) &&
            this.nameRegex.test(groomName) &&
            this.telRegex.test(brideTel) &&
            this.telRegex.test(groomTel) &&
            this.mailRegex.test(brideMail) &&
            this.mailRegex.test(groomMail)
        ) {
            fetch(`${config().apiUrl}/page`, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(this.state.form)
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.error) {
                        throw Error(resp.error)
                    }
                    else {
                        this.setState({ message: resp.message, error: '' })
                    }
                })
                .catch(error => {
                    this.setState({ error: error.message });
                });
        }
        else {
            this.setState({ error: 'Jedno lub więcej z pól, nie zostało wypełnione poprawnie. Kliknij przycisk "RESET", aby przywrócić poprzedni stan.' });
        }
    }
    render() {
        const { pageTitle, weddingDate, brideName, brideMail, brideTel, groomName, groomMail, groomTel, landingpageText } = this.state.form;
        return (
            <div className="page-container">
                <h2>Edytuj stronę</h2>
                <form className="page-form" autoComplete="off">
                    {this.state.error === "" ? null : <h3 className="error-prompt">{this.state.error}</h3>}
                    {this.state.message === "" ? null : <h3 className="message-prompt">{this.state.message}</h3>}
                    <section>
                        <label htmlFor="pageTitle">Tytuł strony</label>
                        <input className="input" type="text" id="pageTitle" onChange={this.pageTitleChangeHandler} value={pageTitle} />
                        <label htmlFor="weddingDate">Data ślubu</label>
                        <input className="input" type="datetime-local" id="weddingDate" onChange={this.weddingDateChangeHandler} value={weddingDate} />
                        <label htmlFor="landingpageText">Tekst na stronie głównej</label>
                        <textarea className="input" id="landingpageText" onChange={this.landingpageTextChangeHandler} value={landingpageText}></textarea>
                    </section>
                    <section>
                        <label htmlFor="brideName">Imię narzeczonej</label>
                        <input className="input" type="text" id="brideName" onChange={this.brideNameChangeHandler} value={brideName} />
                        <label htmlFor="brideTel">Numer telefonu</label>
                        <input className="input" type="text" id="brideTel" onChange={this.brideTelChangeHandler} value={brideTel} />
                        <label htmlFor="brideMail">Adres e-mail</label>
                        <input className="input" type="text" id="brideMail" onChange={this.brideMailChangeHandler} value={brideMail} />
                    </section>
                    <section>
                        <label htmlFor="groomName">Imię narzeczonego</label>
                        <input className="input" type="text" id="groomName" onChange={this.groomNameChangeHandler} value={groomName} />
                        <label htmlFor="groomTel">Numer telefonu</label>
                        <input className="input" type="text" id="groomTel" onChange={this.groomTelChangeHandler} value={groomTel} />
                        <label htmlFor="groomMail">Adres e-mail</label>
                        <input className="input" type="text" id="Mail" onChange={this.groomMailChangeHandler} value={groomMail} />
                    </section>
                    <section>
                        <button className="page-button" type="button" onClick={this.submitForm}>Zatwierdź</button>
                        <button className="page-button" type="button" onClick={this.resetForm}>Reset</button>
                    </section>
                </form>
            </div>
        );
    }
}

export default Page;