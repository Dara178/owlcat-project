<?php

namespace Tests\Feature;

use App\Models\Owlcat;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwlcatApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_can_register_and_receive_sanctum_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ana',
            'email' => 'ana@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'ana@example.com']);
    }

    public function test_user_cannot_register_with_invalid_data(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => '123',
            'password_confirmation' => '456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_login_and_logout(): void
    {
        $user = User::factory()->create([
            'email' => 'testuser@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $loginRes = $this->postJson('/api/auth/login', [
            'email' => 'testuser@example.com',
            'password' => 'secret123',
        ]);

        $loginRes->assertStatus(200);
        $token = $loginRes->json('data.token');

        // Access me
        $meRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/me');

        $meRes->assertStatus(200)
            ->assertJsonPath('data.user.email', 'testuser@example.com');

        // Logout
        $logoutRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $logoutRes->assertStatus(200);
    }

    public function test_user_can_adopt_owlcat_with_initial_stats_and_journal(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', [
                'name' => 'Plumitas',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Plumitas')
            ->assertJsonPath('data.emotion', 'happy')
            ->assertJsonPath('data.level.number', 1)
            ->assertJsonPath('data.stage.code', 'hatchling')
            ->assertJsonPath('data.stats.happiness', 60);

        $this->assertDatabaseHas('owlcats', [
            'user_id' => $user->id,
            'name' => 'Plumitas',
        ]);

        $this->assertDatabaseHas('journal_entries', [
            'type' => 'adoption',
        ]);
    }

    public function test_user_cannot_adopt_multiple_owlcats(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Primero'])
            ->assertStatus(201);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Segundo'])
            ->assertStatus(409);
    }

    public function test_user_can_interact_with_pet_and_stats_update(): void
    {
        $user = User::factory()->create();

        $adoptRes = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Michi']);

        $owlcatId = $adoptRes->json('data.id');

        $interactionRes = $this->actingAs($user, 'sanctum')
            ->postJson("/api/owlcats/{$owlcatId}/interactions", [
                'type' => 'play',
            ]);

        $interactionRes->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'interaction' => ['id', 'type', 'experience_gained'],
                    'owlcat' => ['id', 'name', 'emotion', 'stats', 'level', 'stage'],
                    'message',
                    'events',
                    'unlocked_skills',
                ],
            ])
            ->assertJsonPath('data.interaction.experience_gained', 15);
    }

    public function test_user_cannot_interact_with_another_users_owlcat(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $adoptRes = $this->actingAs($userA, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Michi']);

        $owlcatId = $adoptRes->json('data.id');

        $this->actingAs($userB, 'sanctum')
            ->postJson("/api/owlcats/{$owlcatId}/interactions", [
                'type' => 'pet',
            ])
            ->assertStatus(403);
    }

    public function test_stats_are_clamped_between_0_and_100(): void
    {
        $user = User::factory()->create();
        $adoptRes = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Michi']);
        $owlcatId = $adoptRes->json('data.id');

        // Play repeatedly to reduce energy
        for ($i = 0; $i < 10; $i++) {
            $this->actingAs($user, 'sanctum')
                ->postJson("/api/owlcats/{$owlcatId}/interactions", ['type' => 'play']);
        }

        $owlcat = Owlcat::find($owlcatId);
        $this->assertGreaterThanOrEqual(0, $owlcat->state->energy);
        $this->assertLessThanOrEqual(100, $owlcat->state->happiness);
    }

    public function test_level_up_and_skill_unlock_progression(): void
    {
        $user = User::factory()->create();
        $adoptRes = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Michi']);
        $owlcatId = $adoptRes->json('data.id');

        // 7 plays * 15 xp = 105 xp (threshold for level 2 is 100 xp)
        for ($i = 0; $i < 7; $i++) {
            $res = $this->actingAs($user, 'sanctum')
                ->postJson("/api/owlcats/{$owlcatId}/interactions", ['type' => 'play']);
        }

        $res->assertStatus(200);
        $owlcat = Owlcat::find($owlcatId);

        $this->assertEquals(2, $owlcat->level->number);
        // Level 2 should unlock soft_purr
        $this->assertTrue($owlcat->skills()->where('code', 'soft_purr')->exists());

        // Check journal contains level up entry
        $this->assertTrue($owlcat->journalEntries()->where('type', 'level_up')->exists());
    }

    public function test_journal_and_skills_endpoints(): void
    {
        $user = User::factory()->create();
        $adoptRes = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owlcats', ['name' => 'Michi']);
        $owlcatId = $adoptRes->json('data.id');

        $journalRes = $this->actingAs($user, 'sanctum')
            ->getJson("/api/owlcats/{$owlcatId}/journal");

        $journalRes->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'type', 'title', 'description', 'created_at'],
                ],
            ]);

        $skillsRes = $this->actingAs($user, 'sanctum')
            ->getJson("/api/owlcats/{$owlcatId}/skills");

        $skillsRes->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'unlocked',
                    'locked',
                ],
            ]);

        $stagesRes = $this->actingAs($user, 'sanctum')
            ->getJson('/api/evolution-stages');

        $stagesRes->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
