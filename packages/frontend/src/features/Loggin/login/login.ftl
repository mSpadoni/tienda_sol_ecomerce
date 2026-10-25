<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login - Tienda del Sol</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />
</head>
<body>
    <div class="login">
        <div class="login-container">
            <img
                src="${url.resourcesPath}/img/logo.png"
                alt="Logo Empresa"
                class="logo"
            />

            <div class="welcome-title">Bienvenido a Tienda del Sol</div>

            <form id="kc-form-login" action="${url.loginAction}" method="post">
                <div class="form-group">
                    <label for="username" class="imputs">Usuario</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Ingrese su usuario"
                        autofocus
                    />
                </div>

                <div class="form-group">
                    <label for="password" class="imputs">Contraseña</label>
                    <div class="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                        />
                        <button type="button" class="password-toggle" onclick="togglePassword()">
                            <svg id="password-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="buttons">
                    <input type="submit" class="btn" value="Ingresar" />

                    <#if realm.resetPasswordAllowed>
                        <a href="${url.loginResetCredentialsUrl}" class="btn-secondary">
                            Cambiar contraseña
                        </a>
                    </#if>

                    <a href="http://localhost:3000" class="btn-secondary">
                        Volver
                    </a>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const passwordIcon = document.getElementById('password-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                // Change to eye-slash icon (hidden)
                passwordIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                passwordInput.type = 'password';
                // Change to eye icon (visible)
                passwordIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        }
    </script>
</body>
</html>
