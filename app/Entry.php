<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    protected $fillable = ['name'];

    public function source() {
        return $this->hasOne('App\Source');
    }

    public static function repeated($entryId, $parent, $name) {
        return self::where(['parent_id' => $parent, 'name' => $name])
            ->where('id', '!=', $entryId)->exists();
    }

    public static function alreadyExists($parent, $name) {
        return self::where(['parent_id' => $parent, 'name' => $name])->exists();
    }
}
