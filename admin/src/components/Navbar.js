import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink className="nav-link settings-icon" to='/'>Ustawienia strony</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link guests-icon" to='/guests'>Zarządzanie Gośćmi</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link approach-icon" to='/approach'>Wskazówki dojazdu</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link account-icon" to='/account'>Twoje konto</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;