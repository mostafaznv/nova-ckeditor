<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    public function up()
    {
        Schema::create('images', function(Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('file')->index();
            $table->string('disk', 25)->index();
            $table->string('mime', 35)->index();
            $table->unsignedInteger('width')->index();
            $table->unsignedInteger('height')->index();
            $table->unsignedInteger('size')->index();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('images');
    }
}
