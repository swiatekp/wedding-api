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
        weddingSearchQuery: '',

        partyTips: [],
        partyTipsPageNumber: 0,
        partyTipsRecordsPerPage: 5,
        partySearchQuery: '',
    }

    componentDidMount() {
        this.fetchTips();
    }
    cutString = input => {
        //cuts a string to 20 words
        const inputArray = input.split(" ");
        if (inputArray.length <= 20) {
            //if the string is no longer than 20 words, nothing has to be done.
            return input;
        }
        else {
            let output = inputArray.slice(0, 19).join(' ');
            output += " (...)";
            return output;
        }
    }
    fetchTips = () => {
        fetch(`${config().apiUrl}/api/approach-tips`, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    resp = resp.map(tip => {
                        //cut the contents, so it can fit into the table;
                        return ({
                            ...tip,
                            content: this.cutString(tip.content)
                        })
                    })
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
            method: 'DELETE'
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
                    body: data
                })
                    .then(resp => resp.json())
                    .then(resp => {
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

    weddingSearchHandler = e => {
        const regex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{0,255}$/igm;
        const weddingSearchQuery = e.target.value;
        if (typeof weddingSearchQuery === "string" && regex.test(weddingSearchQuery)) {
            this.setState({ weddingSearchQuery, weddingTipsPageNumber: 0 });
        }
    }

    partySearchHandler = e => {
        const regex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{0,255}$/igm;
        const partySearchQuery = e.target.value;
        if (typeof partySearchQuery === "string" && regex.test(partySearchQuery)) {
            this.setState({ partySearchQuery, partyTipsPageNumber: 0 });
        }
    }

    weddingTipsSwitchPages = e => {
        const { weddingTipsRecordsPerPage, weddingTips } = this.state;
        const weddingTipsPageNumber = parseInt(e.target.value);
        if (weddingTipsPageNumber >= 0 && weddingTipsPageNumber <= Math.ceil(weddingTips.length / weddingTipsRecordsPerPage)) {
            this.setState({ weddingTipsPageNumber });
        }
    }
    partyTipsSwitchPages = e => {
        const { partyTipsRecordsPerPage, partyTips } = this.state;
        const partyTipsPageNumber = parseInt(e.target.value);
        if (partyTipsPageNumber >= 0 && partyTipsPageNumber <= Math.ceil(partyTips.length / partyTipsRecordsPerPage)) {
            this.setState({ partyTipsPageNumber });
        }
    }
    weddingTipsPaginationInputHandler = e => {
        const { weddingTips, weddingTipsPageNumber } = this.state;
        const weddingTipsRecordsPerPage = parseInt(e.target.value);
        if (weddingTipsRecordsPerPage >= 0 && weddingTipsRecordsPerPage <= weddingTips.length) {
            if (weddingTipsPageNumber * weddingTipsRecordsPerPage < weddingTips.length) {
                this.setState({ weddingTipsRecordsPerPage });
            }
        }
        else {
            this.setState({ weddingTipsRecordsPerPage: 5 });
        }
    }
    partyTipsPaginationInputHandler = e => {
        const { partyTips, partyTipsPageNumber } = this.state;
        const partyTipsRecordsPerPage = parseInt(e.target.value);
        if (partyTipsRecordsPerPage >= 0 && partyTipsRecordsPerPage <= partyTips.length) {
            if (partyTipsPageNumber * partyTipsRecordsPerPage < partyTips.length) {
                this.setState({ partyTipsRecordsPerPage });
            }
        }
        else {
            this.setState({ partyTipsRecordsPerPage: 5 });
        }
    }
    moveUp = id => {
        fetch(`${config().apiUrl}/api/approach-tips/moveup/${id}`, {
            method: 'PUT'
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.fetchTips();
                }
            })
            .catch(err => {

            })
    }
    moveDown = id => {
        fetch(`${config().apiUrl}/api/approach-tips/movedown/${id}`, {
            method: 'PUT',
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    this.fetchTips();
                }
            })
            .catch(err => {

            })
    }
    render() {
        const {
            weddingTips,
            partyTips,
            weddingTipsPageNumber,
            partyTipsPageNumber,
            weddingTipsRecordsPerPage,
            partyTipsRecordsPerPage,
            weddingSearchQuery,
            partySearchQuery
        } = this.state;

        let weddingTipsFiltered = [];
        let partyTipsFiltered = [];

        //searching for wedding Tips
        if (weddingSearchQuery !== "") {
            weddingTipsFiltered = weddingTips.filter(tip => {
                const content = tip.content.toLowerCase();
                if (content.indexOf(weddingSearchQuery.toLowerCase()) !== -1) {
                    return true;
                }
                return false;
            });
        }
        else {
            weddingTipsFiltered = weddingTips;
        }

        const weddingTipsToDisplay = weddingTipsFiltered.slice(weddingTipsPageNumber * weddingTipsRecordsPerPage, weddingTipsPageNumber * weddingTipsRecordsPerPage + weddingTipsRecordsPerPage);

        const weddingTipsMapped = weddingTipsToDisplay.map((tip, key) => {
            let img = "";
            tip.filename ? img = `${config().apiUrl}/uploads/${tip.filename}` : img = noMiniature;
            return (
                <tr key={key}>
                    <td className="content-cell">{tip.content}</td>
                    <td className=""><img className="approach-miniature" src={img} alt="Dojazd" /></td>
                    <td className="operations-cell">
                        <div className="approach-operations-container">
                            <NavLink to={`/approach/edit/${tip._id}`} className="edit-button"></NavLink>
                            <button onClick={this.removeTip.bind(this.removeTip, tip._id)} className="remove-button"></button>
                            <div className="up-down-container">
                                <button onClick={this.moveUp.bind(this.moveUp, tip._id)} className="up-button" />
                                <button onClick={this.moveDown.bind(this.moveDown, tip._id)} className="down-button" />
                            </div>
                        </div>
                    </td>

                </tr>
            )
        });
        //pagination
        let weddingTipsNumberOfPages = weddingTipsFiltered.length / weddingTipsRecordsPerPage;
        const weddingTipsButtons = [];
        for (let i = 0; i < weddingTipsNumberOfPages; i++) {
            if (i === weddingTipsPageNumber) {
                //active page
                weddingTipsButtons[i] = <button key={i} onClick={this.weddingTipsSwitchPages} className="pagination-button pagination-button-active" value={i}>{i + 1}</button>;
            }
            else {
                weddingTipsButtons[i] = <button key={i} onClick={this.weddingTipsSwitchPages} className="pagination-button" value={i}>{i + 1}</button>;
            }
        }

        //searching for party tips
        if (partySearchQuery !== "") {
            partyTipsFiltered = partyTips.filter(tip => {
                const content = tip.content.toLowerCase();
                if (content.indexOf(partySearchQuery.toLowerCase()) !== -1) {
                    return true;
                }
                return false;
            });
        }
        else {
            partyTipsFiltered = partyTips;
        }

        const partyTipsToDisplay = partyTipsFiltered.slice(partyTipsPageNumber * partyTipsRecordsPerPage, partyTipsPageNumber * partyTipsRecordsPerPage + partyTipsRecordsPerPage);

        const partyTipsMapped = partyTipsToDisplay.map((tip, key) => {
            let img = "";
            tip.filename ? img = `${config().apiUrl}/uploads/${tip.filename}` : img = noMiniature;
            return (
                <tr key={key}>
                    <td className="content-cell">{tip.content}</td>
                    <td className=""><img className="approach-miniature" src={img} alt="Dojazd" /></td>
                    <td className="operations-cell">
                        <div className="approach-operations-container">
                            <NavLink to={`/approach/edit/${tip._id}`} className="edit-button"></NavLink>
                            <button onClick={this.removeTip.bind(this.removeTip, tip._id)} className="remove-button"></button>
                            <div className="up-down-container">
                                <button onClick={this.moveUp.bind(this.moveUp, tip._id)} className="up-button" />
                                <button onClick={this.moveDown.bind(this.moveDown, tip._id)} className="down-button" />
                            </div>
                        </div>
                    </td>

                </tr>
            )
        });
        //pagination
        let partyTipsNumberOfPages = partyTipsFiltered.length / partyTipsRecordsPerPage;
        const partyTipsButtons = [];
        for (let i = 0; i < partyTipsNumberOfPages; i++) {
            if (i === partyTipsPageNumber) {
                //active page
                partyTipsButtons[i] = <button key={i} onClick={this.partyTipsSwitchPages} className="pagination-button pagination-button-active" value={i}>{i + 1}</button>;
            }
            else {
                partyTipsButtons[i] = <button key={i} onClick={this.partyTipsSwitchPages} className="pagination-button" value={i}>{i + 1}</button>;
            }
        }

        return (
            <div className="approach-container">
                {weddingTips.length !== 0 ? <h2>Dojazd na ślub</h2> : null}
                {
                    weddingTipsToDisplay.length !== 0 ?
                        <>
                            <table className="approach-table">
                                <tbody>
                                    {weddingTipsMapped}
                                </tbody>
                            </table>
                        </> : <h4 className="error-prompt">Nic do wyświetlenia</h4>
                }
                {}
                {weddingTips.length !== 0 ? <input type="search" placeholder="Przeszukaj wskazówki" onChange={this.weddingSearchHandler} value={this.state.weddingSearchQuery} /> : null}

                <div className="pagination-container">
                    {
                        weddingTipsFiltered.length > weddingTipsToDisplay.length ? weddingTipsButtons : null
                    }
                    <p>Wyświetl po:
                            </p>
                    <input type="number" className="pagination-input" min="1" max={weddingTips.length} onChange={this.weddingTipsPaginationInputHandler} value={weddingTipsRecordsPerPage} /> wskazówki.
                        </div>

                {partyTips.length !== 0 ? <h2>Dojazd na wesele</h2> : null}
                {
                    partyTipsToDisplay.length !== 0 ?
                        <>
                            <table className="approach-table">
                                <tbody>
                                    {partyTipsMapped}
                                </tbody>
                            </table>
                        </> : <h4 className="error-prompt">Nic do wyświetlenia</h4>}

                {partyTips.length !== 0 ? <input type="search" onChange={this.partySearchHandler} placeholder="Przeszukaj wskazówki" value={this.state.partySearchQuery} /> : null}
                <div className="pagination-container">
                    {
                        partyTipsFiltered.length > partyTipsToDisplay.length ? partyTipsButtons : null
                    }
                    <p>Wyświetl po:
                            </p>
                    <input type="number" className="pagination-input" min="1" max={partyTips.length} onChange={this.partyTipsPaginationInputHandler} value={partyTipsRecordsPerPage} /> wskazówki.
                        </div>


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