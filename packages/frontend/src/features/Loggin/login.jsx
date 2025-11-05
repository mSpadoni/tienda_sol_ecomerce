import React from "react";
import './login.css';

const Login = () => {
  return (
    <div className="login">
      <div className="login-container">
        <img 
          src="/logo.png"   // si está en public/logo.png
          alt="Logo Empresa" 
          className="logo"
        />

        <div className="welcome-title">Bienvenido a Tienda del Sol</div>

        <form id="kc-form-login" action="/realms/master/login-actions/authenticate" method="post">
          <div className="form-group">
            <label htmlFor="username" className="imputs">Usuario</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              placeholder="Ingrese su usuario"
              autoFocus 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="imputs">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div className="buttons">
            <input type="submit" className="btn" value="Ingresar" />

            <a 
              href="/realms/master/login-actions/reset-credentials" 
              className=" btn-secondary"
            >
              Cambiar contraseña
            </a>

            <a 
              href="http://localhost:3000" 
              className=" btn-secondary"
            >
              Volver
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
