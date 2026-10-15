<?php

namespace App\Policies;

use App\Models\Owlcat;
use App\Models\User;

class OwlcatPolicy
{
    /**
     * Determine whether the user can view the owlcat.
     */
    public function view(User $user, Owlcat $owlcat): bool
    {
        return $user->id === $owlcat->user_id;
    }

    /**
     * Determine whether the user can interact with the owlcat.
     */
    public function interact(User $user, Owlcat $owlcat): bool
    {
        return $user->id === $owlcat->user_id;
    }

    /**
     * Determine whether the user can view the journal of the owlcat.
     */
    public function viewJournal(User $user, Owlcat $owlcat): bool
    {
        return $user->id === $owlcat->user_id;
    }

    /**
     * Determine whether the user can view the skills of the owlcat.
     */
    public function viewSkills(User $user, Owlcat $owlcat): bool
    {
        return $user->id === $owlcat->user_id;
    }
}
