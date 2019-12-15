import React, { Component } from 'react';
import '../css/Account.scss';
import config from '../config';
class Account extends Component {
    state = {
        login: '',
        prevPassword: '',
        newPassword: '',
        message: '',
        error: ''
    }
    nameRegex = /^[a-z0-9_\-.]{0,30}$/;

    loginChangeHandler = e => {
        const value = e.target.value;

        if (this.nameRegex.test(value)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState({ login: value });
    }
    prevPasswordChangeHandler = e => {
        const prevPassword = e.target.value;

        this.setState({ prevPassword });
    }
    newPasswordChangeHandler = e => {
        const newPassword = e.target.value;

        this.setState({ newPassword });
    }
    changePassword = e => {
        e.preventDefault();
        const { login, prevPassword, newPassword } = this.state;
        fetch(`${config().apiUrl}/account/changepassword`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, prevPassword, newPassword })
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
                console.log(err);
                this.setState({ error: err.message, message: '' });
            });

    }
    clearPrompts = () => {
        window.setTimeout(() => this.setState({ message: '', error: '' }), 7000)
    }
    render() {
        const { login, prevPassword, newPassword, message, error } = this.state;
        return (
            <div className="account-container">
                <h2>Zmień hasło</h2>
                {error === "" ? null : <h3 className="error-prompt">{error}</h3>}
                {message === "" ? null : <h3 className="message-prompt">{message}</h3>}
                <form className="account-form">
                    <label htmlFor="login">Login</label>
                    <input type="text" id="login" value={login} onChange={this.loginChangeHandler} />
                    <label htmlFor="prevPassword">Stare hasło</label>
                    <input type="password" id="prevPassword" value={prevPassword} onChange={this.prevPasswordChangeHandler} />
                    <label htmlFor="newPassword">Nowe hasło</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={this.newPasswordChangeHandler} />
                    <button onClick={this.changePassword}>Zmień</button>
                </form>
            </div>
        );
    }
}

export default Account;
