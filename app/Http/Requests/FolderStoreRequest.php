<?php

namespace App\Http\Requests;

use App\Entry;
use App\Services\FilesystemService;
use Illuminate\Foundation\Http\FormRequest;

class FolderStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Consideramos el caso en el que el usuario no ha mandado el parent_id.
        // En ese caso no daría error de autorización, pero sí de validación.
        if ($this->has('parent_id')) {
            $parentEntry = Entry::find($this->input('parent_id'));
            return $parentEntry->owner_id == $this->user()->id;
        }
        return true;
    }

    public function getValidatorInstance() {
        $validator = parent::getValidatorInstance();

        $validator->after(function ($validator) {
            $filesystemService = new FilesystemService();
            if ($filesystemService->nameInUse($this->input('name'), $this->input('parent_id'))) {
                $validator->errors()->add('name', 'Ya existe una carpeta con ese nombre.');
            }
        });

        return $validator;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'parent_id' => 'required|exists:entries,id',
            'name' => 'required|min:1'
        ];
    }
}
