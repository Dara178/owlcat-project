<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            [
                'code' => 'soft_purr',
                'name' => 'Ronroneo Suave',
                'description' => 'Emite un ronroneo vibrante que calma la mente y eleva la felicidad.',
                'required_level' => 2,
                'required_stage_id' => 1,
            ],
            [
                'code' => 'curious_question',
                'name' => 'Pregunta Curiosa',
                'description' => 'Inclina la cabeza y formula una observación perspicaz con ojos brillantes.',
                'required_level' => 3,
                'required_stage_id' => 2,
            ],
            [
                'code' => 'playful_dash',
                'name' => 'Carrera Juguetona',
                'description' => 'Un salto acrobático repentino que ahuyenta todo aburrimiento.',
                'required_level' => 3,
                'required_stage_id' => 2,
            ],
            [
                'code' => 'emotional_memory',
                'name' => 'Memoria Empática',
                'description' => 'Recuerda tus mejores momentos juntos y fortalece el vínculo afectivo.',
                'required_level' => 5,
                'required_stage_id' => 3,
            ],
        ];

        foreach ($skills as $skill) {
            Skill::updateOrCreate(['code' => $skill['code']], $skill);
        }
    }
}
