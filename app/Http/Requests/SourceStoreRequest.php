<?php

namespace App\Http\Requests;

use App\Entry;
use Illuminate\Foundation\Http\FormRequest;
use App\Services\FilesystemService;

class SourceStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $entry = Entry::find($this->input('parent_id'));
        if (!$entry) return false;

        return $entry->owner_id == $this->user()->id;
    }

    public function getValidatorInstance() {
        $validator = parent::getValidatorInstance();

        $validator->after(function ($validator) {
            $filesystemService = new FilesystemService();
            if ($filesystemService->nameInUse($this->input('name'), $this->input('parent_id'))) {
                $validator->errors()->add('name', 'Ya existe un fichero con ese nombre.');
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
            'name' => 'required|min:1',
            'parent_id' => 'required|exists:entries,id'
        ];
    }
}
