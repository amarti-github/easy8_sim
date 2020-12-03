<?php

namespace App\Http\Controllers;

use App\Entry;
use App\Http\Requests\SourceStoreRequest;
use App\Http\Requests\SourceUpdateRequest;
use App\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SourceController extends Controller
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
            'parent_id' => $request->input('parent_id', null)
        ])->whereHas('source')->with(['source'])->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\SourceStoreRequest  $request
     * @return \App\Entry
     */
    public function store(SourceStoreRequest $request)
    {
        $entry = new Entry();
        $entry->name = $request->input('name');
        $entry->parent_id = $request->input('parent_id');
        $entry->owner_id = $request->user()->id;

        $entry->save();

        $entry->source()->create([
            'content' => $request->input('content', '')
        ]);

        return $entry;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Entry  $entry
     * @return \App\Entry
     */
    public function show(Entry $entry)
    {
        $entry->load('source');
        return $entry;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\SourceUpdateRequest  $request
     * @param  \App\Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function update(SourceUpdateRequest $request, Entry $entry)
    {
        if ($request->has('parent_id')) {
            $entry->parent_id = $request->input('parent_id');
        }

        $entry->fill($request->all());
        $entry->update();

        $entry->source()->getResults()->fill([
            'content' => $request->input('content', '')
        ])->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Source  $source
     * @return \Illuminate\Http\Response
     */
    public function destroy(Entry $entry)
    {
        $entry->delete();
    }
}
