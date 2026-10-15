<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdoptOwlcatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Debes asignarle un nombre a tu Owlcat.',
            'name.max' => 'El nombre no puede exceder los 50 caracteres.',
        ];
    }
}
