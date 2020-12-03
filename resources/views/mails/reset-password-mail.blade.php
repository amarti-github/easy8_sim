<html>

<head>

  <title>{{ config('app.name') }} - Recuperar contraseña</title>

</head>

<body>

<h1>{{ config('app.name') }}</h1>

<p>
  Para verificar recuperar tu contraseña, accede a este enlace: <a href="{{ url('/#/reset-password') . '?user_id=' . $user->id . '&remember_token=' . $user->remember_token }}">
    {{ url('/#/reset-password') . '?remember_token=' . $user->remember_token }}
  </a>
</p>


</body>

</html>
