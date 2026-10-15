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
        Schema::create('owlcat_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owlcat_id')->unique()->constrained('owlcats')->cascadeOnDelete();
            $table->unsignedTinyInteger('happiness')->default(50);
            $table->unsignedTinyInteger('energy')->default(50);
            $table->unsignedTinyInteger('curiosity')->default(50);
            $table->unsignedTinyInteger('boredom')->default(50);
            $table->unsignedTinyInteger('bond')->default(0);
            $table->timestamp('last_interacted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owlcat_states');
    }
};
