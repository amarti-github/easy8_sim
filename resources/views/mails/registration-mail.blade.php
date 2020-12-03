<html>

<head>

  <title>{{ config('app.name') }} - Confirmación de registro</title>

</head>

<body>

<h1>{{ config('app.name') }}</h1>

<p>
  Para verificar tu correo accede a este enlace: <a href="{{ url('/#/login') . '?user_id=' . $user->id . '&confirmation_token=' . $user->confirmation_token }}">
    {{ url('/#/login') . '?user_id=' . $user->id . '&confirmation_token=' . $user->confirmation_token }}
  </a>
</p>


</body>

</html>
