import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';
import pageList from '../pagelist.js';
const Navbar = () => {
    const pages = pageList().map((page, key) => (
        <li key={key}>
            <NavLink className={`nav-link ${page.className}`} to={page.path}>{page.name}</NavLink>
        </li>
    ));
    return (
        <nav>
            <ul>
                {pages}
            </ul>
        </nav>
    );
}

export default Navbar;