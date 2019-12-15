import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink className="nav-link settings-icon" to={`/`}>Ustawienia strony</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link guests-icon" to={`/guests`}>Goście</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link approach-icon" to={`/approach`}>Dojazd</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link account-icon" to={`/account`}>Konto</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link logout-icon" to={`/logout`}>Wyloguj się</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;