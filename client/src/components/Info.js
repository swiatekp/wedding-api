import React from 'react';
import '../css/Info.scss';
import ApproachButton from './ApproachButton.js';
import { NavLink } from 'react-router-dom';
const Info = (props) => {
    return (
        <div className="slider-container no-overflow">
            <div dangerouslySetInnerHTML={{ __html: props.pageInfo.landingpageText }}></div>
            <NavLink to={'/approach'}><ApproachButton /></NavLink>
        </div>
    );
}

export default Info;