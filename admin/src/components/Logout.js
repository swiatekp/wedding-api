import React, { Component } from 'react';
import loadingImg from '../img/loading.svg';
import config from '../config';

class Logout extends Component {
    state = {}
    componentDidMount() {
        fetch(`${config().apiUrl}/login/logout`, {
            method: 'GET',
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                else {
                    window.location.replace(`${config().apiUrl}/loginform`);
                }
            })
            .catch(err => {
                this.setState({ error: err.message });
            })
    }
    render() {
        return (
            <div>
                <img className="loading-circle" alt="loading" src={loadingImg} />
            </div>
        );
    }
}

export default Logout;