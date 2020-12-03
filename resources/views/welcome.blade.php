<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Simulador de un procesador didáctico de 8 bits.">

        <title>Easy8</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <!-- Styles -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">

        @if (!App::environment('local'))
            <link href="{{ secure_asset('css/app.css') }}" rel="stylesheet">
        @endif

    </head>
    <body>
        <div id="app">
            <header>
                Easy8
                <i class="fas fa-info-circle clickable about-button" v-on:click="aboutModalVisible=!aboutModalVisible"></i>
            </header>

            <router-view name="main-view"></router-view>

            <!-- ABOUT MODAL -->
            <div class="modal about-modal" v-bind:class="{ 'visible': aboutModalVisible }">
                <h2>Acerca de Easy8</h2>
                <div class="content">
                    <h4>Trabajo de fin de grado</h4>
                    <h3>Simulación y almacenamiento de programas del Easy8 en Web</h3>

                    <div>Autor: Rafael González Carrizo</div>
                    <div>Tutor: Antonio Martí Campoy</div>
                    <div class="year">Curso 2018-2019</div>

                    <div style="text-align: right; margin-top: 20px"><a class="btn" v-on:click="aboutModalVisible=false">Cerrar</a></div>

                </div>
            </div>

        </div>


    <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
