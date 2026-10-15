<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EvolutionStageSeeder::class,
            LevelSeeder::class,
            SkillSeeder::class,
        ]);

        // Create default demo user for quick testing if doesn't exist
        User::firstOrCreate(
            ['email' => 'demo@owlcat.digital'],
            [
                'name' => 'Cuidador Demo',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
