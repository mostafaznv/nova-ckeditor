<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAudioTable extends Migration
{
    public function up(): void
    {
        Schema::create('audio', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('file')->index();
            $table->string('disk', 25)->index();
            $table->unsignedInteger('size')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio');
    }
};
