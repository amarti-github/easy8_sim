<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FolderUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function getValidatorInstance() {
        $validator = parent::getValidatorInstance();

        $validator->after(function ($validator) {
            $filesystemService = new FilesystemService();

            // Si se está modificando el nombre o el parent_id hay
            // que validar que el nombre del fichero siga siendo único.
            if ($this->has('name') || $this->has('parent_id')) {
                $entry = $this->route('entry');
                if ($filesystemService->nameInUse($this->input('name', $entry->name), $this->input('parent_id', $entry->parent_id), $entry)) {
                    $validator->errors()->add('name', 'Ya existe un fichero con ese nombre.');
                }
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
            'parent_id' => 'sometimes|exists:entries,id',
            'name' => 'sometimes|min:1'
        ];
    }
}
