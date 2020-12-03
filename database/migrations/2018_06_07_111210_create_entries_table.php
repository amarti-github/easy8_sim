<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('parent_id')->unsigned()->nullable();
            $table->integer('owner_id')->unsigned();
            $table->string('name');
            $table->timestamps();

            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('parent_id')->references('id')->on('entries')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //Schema::dropForeign('entries_owner_id_foreign');
        Schema::dropIfExists('entries');
    }
}
