<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', 'UserController@login');
Route::post('/user', 'UserController@store');
Route::post('/user/{user}/confirm', 'UserController@confirm');

Route::post('/password-reset', 'UserController@requestReset');
Route::post('/password-reset/{rememberToken}', 'UserController@executeReset');

Route::middleware('auth:api')->group(function () {
    // Obtener los datos del usuario.
    Route::get('/user/{user}', 'UserController@show');

    Route::get('/folder', 'FolderController@index');
    Route::post('/folder', 'FolderController@store');
    Route::post('/folder/{id}', 'FolderController@update')->middleware('can:update,entry');
    Route::delete('/folder/{entry}', 'FolderController@destroy')->middleware('can:delete,entry');

    Route::post('/entry/{id}', 'EntryController@update');

    Route::get('/source/{entry}', 'SourceController@show')->middleware('can:view,entry');
    Route::get('/source', 'SourceController@index');
    Route::post('/source', 'SourceController@store');
    Route::post('/source/{entry}', 'SourceController@update')->middleware('can:update,entry');
    Route::delete('/source/{entry}', 'SourceController@destroy')->middleware('can:delete,entry');
});
