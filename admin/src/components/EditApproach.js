import React, { Component } from 'react';
import config from '../config';
import '../css/EditApproach.scss';
import { NavLink } from 'react-router-dom';
import noMiniature from '../img/no-miniature.svg';

class EditApproach extends Component {
    state = {
        tip: {
        },
        file: null,
        editError: '',
        editMessage: '',
        illustrationError: '',
        illustrationMessage: ''
    }

    componentDidMount() {
        this.tipId = this.props.match.params.id;
        this.fetchTip();
    }

    fetchTip = () => {
        fetch(`${config().apiUrl}/api/approach-tips/by-id/${this.tipId}`, {
            method: 'GET',
        })
            .then(resp => resp.json())
            .then(tip => {
                if (tip.error) {
                    throw new Error(tip.error);
                }
                else {
                    this.setState(prevState => ({
                        ...prevState,
                        tip,
                    }))
                }
            })
            .catch(err => {
                this.setState({ editError: err.message, editMessage: '' });
                this.clearPrompts();
            });
    }

    clearPrompts = () => {
        window.setTimeout(() => this.setState({ editMessage: '', editError: '', illustrationMessage: '', illustrationError: '' }), 7000)
    }

    contentChangeHandler = e => {
        const contentRegex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{0,255}$/igm;
        const content = e.target.value;
        if (contentRegex.test(content)) {
            e.target.classList.remove('error');
        }
        else {
            e.target.classList.add('error');
        }
        this.setState(prevState => ({
            ...prevState,
            tip: {
                ...prevState.tip,
                content
            }
        }));
    }

    categoryChangeHandler = e => {
        let category = e.target.value;
        if (category !== "1" && category !== "2") {
            category = "0";
        }
        this.setState(prevState => ({
            ...prevState,
            tip: {
                ...prevState.tip,
                category
            }
        }));
    }
    imageChangeHandler = e => {
        const file = e.target.files[0];
        this.setState(prevState => ({
            ...prevState,
            file
        }))
    }
    sendEdit = e => {
        e.preventDefault();
        const { content, category } = this.state.tip;
        if (typeof content === "string" && /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{5,255}$/igm.test(content)) {
            if (category === "1" || category === "2") {
                fetch(`${config().apiUrl}/api/approach-tips/${this.tipId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ category, content })
                })
                    .then(resp => resp.json())
                    .then(resp => {
                        this.setState({ editError: '', editMessage: resp.message });
                        this.clearPrompts();
                    })
                    .catch(err => {
                        this.setState({ editError: err.message, editMessage: '' });
                        this.clearPrompts();
                    });
            }
            else {
                this.setState({ editError: 'Nieprawidłowa kategoria', editMessage: '' });
                this.clearPrompts();
            }
        }
        else {
            this.setState({ editError: 'Nieprawidłowa treść wskazówki', editMessage: '' });
            this.clearPrompts();
        }
    }
    sendIllustraton = e => {
        e.preventDefault();
        if (this.state.file) {
            const data = new FormData();
            data.append('file', this.state.file);

            fetch(`${config().apiUrl}/api/approach-tips/changeImage/${this.tipId}`, {
                method: 'PUT',
                body: data
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.error) {
                        throw new Error(resp.error);
                    }
                    else {
                        this.setState(prevState => ({
                            ...prevState, illustrationMessage: resp.message, illustrationError: '',
                        }));
                        this.clearPrompts();
                        this.fetchTip();
                    }
                })
                .catch(err => {
                    this.setState({ illustrationError: err.message, illustrationMessage: '' });
                    this.clearPrompts();
                })
        }
        else {
            this.setState({
                illustrationError: 'Nie wybrano pliku',
                illustrationMessage: ''
            })
            this.clearPrompts();
        }
    }
    removeIllustration = e => {
        e.preventDefault();
        fetch(`${config().apiUrl}/api/approach-tips/remove-illustration/${this.tipId}`, {
            method: 'DELETE',
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.setState(prevState => ({
                        ...prevState, illustrationMessage: resp.message, illustrationError: '',
                    }));
                    this.clearPrompts();
                    this.fetchTip();
                }
            })
            .catch(err => {
                this.setState({ illustrationError: err.message, illustrationMessage: '' });
                this.clearPrompts();
            })
    }
    render() {
        const { _id, content, category, filename } = this.state.tip;
        const { editError, editMessage, illustrationError, illustrationMessage } = this.state;
        let img = '';
        filename ? img = `${config().apiUrl}/uploads/${filename}` : img = noMiniature;
        return (
            <div className="edit-approach-container">
                <p className="localization"><NavLink to={`/approach`}>Wskazówki dojazdu</NavLink> > <NavLink to={`/approach/edit/${_id}`}>Edycja wskazówki</NavLink></p>

                {Object.keys(this.state.tip).length > 0 ?
                    <>
                        <form className="add-approach-tip-form">
                            <h2>Edycja wskazówki</h2>

                            {editError === "" ? null : <h3 className="error-prompt">{editError}</h3>}
                            {editMessage === "" ? null : <h3 className="message-prompt">{editMessage}</h3>}

                            <label htmlFor="content">Treść wskazówki</label>
                            <textarea id="content" onChange={this.contentChangeHandler} value={content}></textarea>
                            <label htmlFor="category">Dojazd dokąd?</label>
                            <select onChange={this.categoryChangeHandler} value={category}>
                                <option value="0">-</option>
                                <option value="1">Ślub</option>
                                <option value="2">Wesele</option>
                            </select>
                            <button onClick={this.sendEdit}>Zatwierdź</button>
                        </form>
                        <form className="edit-illustration">

                            {illustrationError === "" ? null : <h3 className="error-prompt">{illustrationError}</h3>}
                            {illustrationMessage === "" ? null : <h3 className="message-prompt">{illustrationMessage}</h3>}

                            <h2>Ilustracja</h2>
                            <img className="illustration-img" src={img} alt="ilustracja" />
                            {filename ? <button onClick={this.removeIllustration}>Usuń</button> : null}
                            <label htmlFor="image">{filename ? "Zmień ilustrację" : "Dodaj ilustrację"}</label>
                            <input type="file" id="image" onChange={this.imageChangeHandler} />
                            <button onClick={this.sendIllustraton}>Zatwierdź</button>
                        </form>
                    </>
                    :
                    <h3 className="error-prompt">{editError}</h3>}
            </div>
        );
    }
}

export default EditApproach;