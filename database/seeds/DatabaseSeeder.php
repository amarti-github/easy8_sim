<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $userId = DB::table('users')->insertGetId([
            'name' => 'Demo',
            'surname' => 'Demo',
            'email' => 'demo@demo.com',
            'password' => bcrypt('123456'),
            'api_token' => str_random(60),
            'status' => 1
        ]);

        ///////////////////////////////////
        ///     INSERT ROOT FOLDER      ///
        ///////////////////////////////////

        $rootId = DB::table('entries')->insertGetId([
            'parent_id' => null,
            'owner_id' => $userId,
            'name' => 'root'
        ]);

        DB::table('folders')->insert([
            'entry_id' => $rootId,
            'inbox' => false
        ]);

        ///////////////////////////////////
        ///        INSERT SOURCE        ///
        ///////////////////////////////////

        $sourceId = DB::table('entries')->insertGetId([
            'parent_id' => $rootId,
            'owner_id' => $userId,
            'name' => 'test.asm'
        ]);

        DB::table('sources')->insert([
            'entry_id' => $sourceId,
            'type' => 0,
            'content' => 'HELLO WORLD'
        ]);

        // $this->call(UsersTableSeeder::class);
    }
}
