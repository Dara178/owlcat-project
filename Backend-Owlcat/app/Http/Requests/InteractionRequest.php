<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InteractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:pet,play,talk,care'],
            'message' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'El tipo de interacción es obligatorio.',
            'type.in' => 'La interacción seleccionada no es válida. Debe ser pet, play, talk o care.',
            'message.max' => 'El mensaje no puede superar los 500 caracteres.',
        ];
    }
}
