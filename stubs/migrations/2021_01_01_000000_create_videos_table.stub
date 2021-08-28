<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideosTable extends Migration
{
    public function up()
    {
        Schema::create('videos', function(Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->upload('file');
            // $table->string('file')->index(); // in case that you don't want Larupload
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('videos');
    }
}
