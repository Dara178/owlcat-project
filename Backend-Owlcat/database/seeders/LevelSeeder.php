<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            [
                'number' => 1,
                'name' => 'Pequeño curioso',
                'required_experience' => 0,
                'evolution_stage_id' => 1,
            ],
            [
                'number' => 2,
                'name' => 'Pequeño aprendiz',
                'required_experience' => 100,
                'evolution_stage_id' => 1,
            ],
            [
                'number' => 3,
                'name' => 'Joven explorador',
                'required_experience' => 250,
                'evolution_stage_id' => 2,
            ],
            [
                'number' => 4,
                'name' => 'Joven sabio',
                'required_experience' => 450,
                'evolution_stage_id' => 2,
            ],
            [
                'number' => 5,
                'name' => 'Compañero místico',
                'required_experience' => 700,
                'evolution_stage_id' => 3,
            ],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(['number' => $level['number']], $level);
        }
    }
}
