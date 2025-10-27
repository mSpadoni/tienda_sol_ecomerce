import React from "react";
import {FaShoppingCart} from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
    return (
        <>
            <header className="navbar-bg">
                <nav className="navbar">
                    <div className="navbar-section left">
                        <button className="menu-icon">☰</button>
                    </div>

                    <div className="navbar-section center">
                        <div>
                            <h1>TiendaSol.com</h1>
                        </div>
                    </div>

                    <div className="navbar-section right">
                        <button className="cart">
                            <FaShoppingCart color="black"/>
                            <span className="cart-count">0</span>
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
