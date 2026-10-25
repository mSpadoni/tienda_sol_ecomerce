<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Bienvenido - Tienda del Sol</title>
    <style>
        :root {
          --main-yellow: #ffb800;
          --main-yellow-dark: #e6a800;
          --white: #fff;
        }
        .login {
          background-color: var(--main-yellow);
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .login-container {
          background: var(--white);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 90%;
          text-align: center;
        }
        .welcome-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }
        .btn {
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          color: #000;
          background-color: var(--main-yellow);
          transition: background-color 0.3s;
          display: inline-block;
        }
        .btn:hover {
          background-color: var(--main-yellow-dark);
        }
    </style>
</head>
<body>
    <div class="login">
        <div class="login-container">
            <div class="welcome-title">Bienvenido a Tienda del Sol</div>
            <p>Keycloak está en línea y listo para usar</p>
            <a href="/admin" class="btn">Ir a Admin</a>
        </div>
    </div>
</body>
</html>
