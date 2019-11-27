import React, { Component } from 'react';
import '../css/Approach.scss';
import { NavLink } from 'react-router-dom';
import config from '../config';
import noMiniature from '../img/no-miniature.svg';
class Approach extends Component {
    state = {
        form: {
            content: '',
            category: '',
            file: null,
        },
        message: '',
        error: '',

        weddingTips: [],
        weddingTipsPageNumber: 0,
        weddingTipsRecordsPerPage: 5,

        partyTips: [],
        partyTipsPageNumber: 0,
        partyTipsRecordsPerPage: 5,
    }
    componentDidMount() {
        this.fetchTips();
    }
    fetchTips = () => {
        fetch(`${config().apiUrl}/api/approach-tips`, {
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
                    const weddingTips = resp.filter(tip => {
                        if (tip.category === "1") return true;
                        return false
                    });

                    const partyTips = resp.filter(tip => {
                        if (tip.category === "2") return true;
                        return false
                    });

                    this.setState({ weddingTips, partyTips });
                }
            })
            .catch(err => {
                this.setState({ error: err.message });
            })
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
            form: {
                ...prevState.form,
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
            form: {
                ...prevState.form,
                category
            }
        }));
    }
    imageChangeHandler = e => {
        const file = e.target.files[0];
        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                file
            }
        }))
    }
    removeTip = id => {
        fetch(`${config().apiUrl}/api/approach-tips/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${this.props.bearer}`,
            },
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.clearPrompts();
                    this.fetchTips();
                }
            })
            .catch(err => {
                this.setState({ error: err.message, message: '' });
                this.clearPrompts();
            })
    }
    sendForm = e => {
        e.preventDefault();
        const { content, category, file } = this.state.form;
        if (typeof content === "string" && /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{5,255}$/igm.test(content)) {
            if (category === "1" || category === "2") {
                const data = new FormData();
                data.append('content', content);
                data.append('category', category);
                data.append('file', file);

                fetch(`${config().apiUrl}/api/approach-tips`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${this.props.bearer}`,
                    },
                    body: data
                })
                    .then(resp => resp.json())
                    .then(resp => {
                        console.log(resp);
                        if (resp.error) {
                            throw new Error(resp.error);
                        }
                        else {
                            this.setState(prevState => ({
                                ...prevState, message: resp.message, error: '',
                                form: {
                                    content: '',
                                    category: '',
                                    file: null,
                                }
                            }));
                            this.clearPrompts();
                            this.fetchTips();
                        }
                    })
                    .catch(err => {
                        this.setState({ error: err.message, message: '' });
                        this.clearPrompts();
                    })
            }
            else {
                this.setState({ message: '', error: 'Należy podać kategorię' });
                this.clearPrompts();
            }
        }
        else {
            this.setState({ message: '', error: 'Treść wskazówki powinna zawierać od 5 do 255 znaków' });
            this.clearPrompts();
        }
    }
    clearPrompts = () => {
        window.setTimeout(() => this.setState({ message: '', error: '' }), 7000)
    }
    render() {
        const weddingTips = this.state.weddingTips.map((tip, key) => {
            let img = "";
            tip.filename ? img = `${config().apiUrl}/uploads/${tip.filename}` : img = noMiniature;
            return (
                <tr key={key}>
                    <td className="">{key + 1}</td>
                    <td className="">{tip.content}</td>
                    <td className=""><img className="approach-miniature" src={img} alt="Dojazd" /></td>
                    <td className="operations-cell">
                        <NavLink to="" className="edit-button"></NavLink>
                        <button onClick={this.removeTip.bind(this.removeTip, tip._id)} className="remove-button"></button>
                    </td>

                </tr>
            )
        });
        const partyTips = this.state.partyTips.map((tip, key) => {
            let img = "";
            tip.filename ? img = `${config().apiUrl}/uploads/${tip.filename}` : img = noMiniature;
            return (
                <tr key={key}>
                    <td className="">{key + 1}</td>
                    <td className="">{tip.content}</td>
                    <td className=""><img className="approach-miniature" src={img} alt="Dojazd" /></td>
                    <td className="operations-cell">
                        <NavLink to="" className="edit-button"></NavLink>
                        <button onClick={this.removeTip.bind(this.removeTip, tip._id)} className="remove-button"></button>
                    </td>

                </tr>
            )
        });
        return (
            <div className="approach-container">
                {this.state.weddingTips.length !== 0 && this.state.partyTips !== 0 ?
                    <h2>Wskazówki dojazdu</h2> : null
                }
                {
                    this.state.weddingTips.length !== 0 ?
                        <>
                            <h3>Ślub</h3>
                            <table className="approach-table">
                                <thead>
                                    <tr>
                                        <td className="">Nr</td>
                                        <td className="">Treść</td>
                                        <td className="">Miniatura</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weddingTips}
                                </tbody>
                            </table>
                        </> : null
                }
                {
                    this.state.partyTips.length !== 0 ?
                        <>
                            <h3>Wesele</h3>
                            <table className="approach-table">
                                <thead>
                                    <tr>
                                        <td className="">Nr</td>
                                        <td className="">Treść</td>
                                        <td className="">Miniatura</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partyTips}
                                </tbody>
                            </table>
                        </> : null}
                {this.state.message !== "" ? <h3 className="message-prompt">{this.state.message}</h3> : null}
                {this.state.error !== "" ? <h3 className="error-prompt">{this.state.error}</h3> : null}
                <h2>Dodaj wskazówkę dojazdu</h2>
                <form className="add-approach-tip-form">
                    <label htmlFor="content">Treść wskazówki</label>
                    <textarea id="content" onChange={this.contentChangeHandler} value={this.state.form.content}></textarea>
                    <label htmlFor="category">Dojazd dokąd?</label>
                    <select onChange={this.categoryChangeHandler} value={this.state.form.category}>
                        <option value="0">-</option>
                        <option value="1">Ślub</option>
                        <option value="2">Wesele</option>
                    </select>
                    <label htmlFor="image">Ilustracja</label>
                    <input type="file" id="image" onChange={this.imageChangeHandler} />
                    <button onClick={this.sendForm}>Dodaj</button>
                </form>
            </div>
        );
    }
}

export default Approach;