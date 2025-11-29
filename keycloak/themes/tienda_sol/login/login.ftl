<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tienda del Sol - Login</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
</head>
<body>
  <div class="login-container">
    <img src="${url.resourcesPath}/img/logo.png" alt="Logo" class="logo" />
    <div class="welcome-title">Bienvenido a Tienda del Sol</div>

    <#if message??>
      <div class="error-message">
        <#if message.summary == "Invalid username or password.">
          Usuario o contraseña incorrectos
        <#else>
          ${message.summary}
        </#if>
      </div>
    </#if>

    <form id="kc-form-login" action="${url.loginAction}" method="post">
      <div class="form-group">
        <label for="username">Usuario</label>
        <input id="username" name="username" type="text" placeholder="Ingrese su usuario o email" autofocus />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" placeholder="Ingrese su contraseña" />
        <button type="button" class="show-password" onclick="togglePassword()">
          <img id="eyeIcon" class="img-password" src="${url.resourcesPath}/img/eye-hidden.png" alt="Mostrar contraseña" />
        </button>
      </div>

      <div class="buttons">
        <input type="submit" class="btn" value="Ingresar" />

        <#if resetCredentialsUrl??>
          <a href="${resetCredentialsUrl}" class="btn-secondary">Cambiar contraseña</a>
        </#if>

        <a href="${properties.url_frontend}/registro" class="btn-secondary">Crear cuenta</a>

        <a href="${properties.url_frontend}" class="btn-secondary">Volver</a>
      </div>
    </form>
  </div>

  <script>
  const resourcesPath = '${url.resourcesPath}';
  
  function togglePassword() {
    const input = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon.src = resourcesPath + '/img/eye-visible.png';
      eyeIcon.alt = 'Ocultar contraseña';
    } else {
      input.type = 'password';
      eyeIcon.src = resourcesPath + '/img/eye-hidden.png';
      eyeIcon.alt = 'Mostrar contraseña';
    }
  }
  </script>
</body>
</html>
