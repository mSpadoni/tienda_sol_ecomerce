<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tienda del Sol - Login</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
</head>
<body>
  <div class="login-wrapper">
    <h1>Bienvenido a Tienda del Sol</h1>

    <#if message??>
      <div class="alert-error">${message.summary}</div>
    </#if>

    <form id="kc-form-login" action="${url.loginAction}" method="post">
      <div class="field">
        <label for="username">Usuario</label>
        <input id="username" name="username" type="text" autofocus />
      </div>

      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" />
      </div>

      <input class="login-btn" type="submit" value="Ingresar" />
    </form>

    <#-- La cuenta se crea en la tienda: así se guarda el usuario en Keycloak y en MongoDB con su rol -->
    <#if client?? && client.baseUrl?has_content>
      <p class="register-link">
        ¿No tenés cuenta?
        <a href="${client.baseUrl}/registro">Creá tu cuenta</a>
      </p>
      <p class="register-link">
        <a href="${client.baseUrl}">Volver a la tienda sin iniciar sesión</a>
      </p>
    </#if>
  </div>
</body>
</html>
