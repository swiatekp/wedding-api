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
                    <NavLink className="nav-link guests-icon" to={`/guests?bearer=${props.bearer}`}>Goście</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link approach-icon" to={`/approach?bearer=${props.bearer}`}>Dojazd</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link account-icon" to={`/account?bearer=${props.bearer}`}>Konto</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link logout-icon" to={`/logout?bearer=${props.bearer}`}>Wyloguj się</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;