import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import noMiniature from '../img/no-miniature.svg';
import config from '../config.json';

class ApproachViewer extends Component {
    state = {}
    render() {
        console.log(this.props.tips);
        const { tips } = this.props;
        const tipsMapped = tips.map((tip, key) => {
            let img = "";
            let zoomable = null;
            if (tip.filename) {
                img = `${config.apiUrl}/uploads/${tip.filename}`;
                zoomable = true;
            }
            else {
                img = noMiniature;
                zoomable = false;
            }

            return (
                <tr key={key}>
                    <td className="content-cell">
                        {tip.content}
                    </td>
                    <td className="miniature-cell">
                        <img onClick={zoomable ? () => this.props.showImage(img) : null}
                            className={`approach-miniature ${zoomable ? 'zoomable' : ''}`}
                            src={img}
                            alt="Dojazd" />
                    </td>
                </tr>
            );
        })
        return (
            <div className="slider-container approach-show">
                <h3>Dojazd do kościoła</h3>
                <div className="approach-show-container">
                    <table className="approach-table">
                        <tbody>
                            {tipsMapped}
                        </tbody>
                    </table>
                </div>
                <NavLink className="return-link" to="/approach">&lt;&lt; Powrót</NavLink>
            </div>
        );
    }
}

export default ApproachViewer;