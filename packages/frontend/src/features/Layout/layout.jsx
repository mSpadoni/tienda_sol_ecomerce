import Navbar from "../../components/headers/Navbar";
import Footer from "../../components/footer/Footer";
import { Outlet } from "react-router-dom";
import React from "react";
import './layout.css';

const Layout = () => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;