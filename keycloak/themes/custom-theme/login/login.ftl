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
        <label for="password">Contrasena</label>
        <input id="password" name="password" type="password" />
      </div>

      <input class="login-btn" type="submit" value="Ingresar" />
    </form>
  </div>
</body>
</html>
