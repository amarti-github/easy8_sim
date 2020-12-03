<?php

namespace App\Http\Controllers;

use App\Entry;
use App\Http\Requests\FolderStoreRequest;
use App\Http\Requests\FolderUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return Entry::where([
            'owner_id' => $request->user()->id,
            'parent_id' => $request->get('parent_id', null)
        ])->doesntHave('source')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\FolderStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FolderStoreRequest $request)
    {
        $entry = new Entry();
        $entry->name = $request->input('name');
        $entry->parent_id = $request->input('parent_id');
        $entry->owner_id = $request->user()->id;

        $entry->save();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\FolderUpdateRequest  $request
     * @param  \App\Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function update(FolderUpdateRequest $request, Entry $entry)
    {
        $entry->fill($request->all());
        $entry->save();

        return $entry;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function destroy(Entry $entry)
    {
        $entry->delete();
    }
}
