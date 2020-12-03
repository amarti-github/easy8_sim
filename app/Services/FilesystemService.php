<?php
namespace App\Services;
/**
 * Created by PhpStorm.
 * User: rafa
 * Date: 6/1/19
 * Time: 6:09 PM
 */
use App\Entry;

class FilesystemService {
    public function nameInUse($name, $containerEntryId, $distinctEntryId = null) {
        $query = Entry::where(['parent_id' => $containerEntryId, 'name' => $name]);

        if ($distinctEntryId) {
            $query->where('id', '!=', $distinctEntryId);
        }

        return $query->exists();
    }

    public function copy(Entry $entry, $targetId) {
        $pending = [[$entry, $targetId]];

        while (!empty($pending)) {
            list($entry, $targetId) = array_pop($pending);

            // Copiar la entrada.
            $newEntry = new Entry();
            $newEntry->parent_id = $targetId;
            $newEntry->owner_id = $entry->owner_id;
            $newEntry->name = $entry->name;
            $newEntry->updated_at = $entry->updated_at;
            $newEntry->created_at = $entry->created_at;
            $newEntry->save();

            if ($entry->source) {
                // Copiar también el código asociado, si lo tiene.
                $newEntry->source()->create([
                    'content' => $entry->source->content
                ]);
            }
            else {
                // Se trata de una carpeta, hay que preocuparse de
                // copiar también todo el contenido de esta.
                $children = $entry->children();
                foreach ($children as &$child) {
                    array_push($pending, [$child, $newEntry->id]);
                }
            }
        }
    }
}