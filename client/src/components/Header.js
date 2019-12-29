import React from 'react';
import '../css/Header.scss';

const Header = (props) => {
    return (
        <header>
            <h1>{`${props.pageInfo.pageTitle}`}</h1>
            <h2>{`${props.pageInfo.weddingDate}`}</h2>
        </header>
    );
}
export default Header;