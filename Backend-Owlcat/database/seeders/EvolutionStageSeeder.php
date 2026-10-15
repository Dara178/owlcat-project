<?php

namespace Database\Seeders;

use App\Models\EvolutionStage;
use Illuminate\Database\Seeder;

class EvolutionStageSeeder extends Seeder
{
    public function run(): void
    {
        $stages = [
            [
                'id' => 1,
                'code' => 'hatchling',
                'name' => 'Polluelo',
                'description' => 'Un pequeño gato-búho recién nacido, curioso y adorable que descubre su entorno.',
                'min_level' => 1,
                'max_level' => 2,
            ],
            [
                'id' => 2,
                'code' => 'young',
                'name' => 'Joven Explorador',
                'description' => 'Más ágil y avispado, con plumaje suave y reflejos veloces.',
                'min_level' => 3,
                'max_level' => 4,
            ],
            [
                'id' => 3,
                'code' => 'companion',
                'name' => 'Compañero Místico',
                'description' => 'Una criatura sabia, majestuosa y profundamente vinculada con su cuidador.',
                'min_level' => 5,
                'max_level' => null,
            ],
        ];

        foreach ($stages as $stage) {
            EvolutionStage::updateOrCreate(['id' => $stage['id']], $stage);
        }
    }
}
