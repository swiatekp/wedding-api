import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.scss';

const Navbar = (props) => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink className="nav-link settings-icon" to={`/?bearer=${props.bearer}`}>Ustawienia strony</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link guests-icon" to={`/guests?bearer=${props.bearer}`}>Zarządzanie Gośćmi</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link approach-icon" to={`/approach?bearer=${props.bearer}`}>Wskazówki dojazdu</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link account-icon" to={`/account?bearer=${props.bearer}`}>Twoje konto</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;