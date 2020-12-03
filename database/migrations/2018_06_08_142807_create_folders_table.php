<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->bigInteger('entry_id')->unsigned();
            $table->boolean('inbox');
            $table->string('inbox_name')->nullable()->unique();

            $table->primary('entry_id');
            $table->foreign('entry_id')->references('id')->on('entries')->onUpdate('cascade')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //$table->dropForeign(['entry_id']);
        Schema::dropIfExists('folders');
    }
}
