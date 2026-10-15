<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('owlcats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 50);
            $table->string('species', 30)->default('owlcat');
            $table->foreignId('level_id')->constrained('levels');
            $table->foreignId('evolution_stage_id')->constrained('evolution_stages');
            $table->unsignedInteger('experience')->default(0);
            $table->string('current_emotion', 30)->default('happy');
            $table->timestamp('adopted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owlcats');
    }
};
