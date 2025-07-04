<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Tenants
        $tenantRecords = [];
        $tenants = [
            [
                'school_name' => 'Tawan Online School',
                'address' => 'Kabul - Afghanistan',
            ],
            [
                'school_name' => 'Afghan Girls Education Center',
                'address' => 'All - Afghanistan',
            ]
        ];

        foreach ($tenants as $tenant) {
            $tenantRecords[] = Tenant::create($tenant);
        }

        // 2. Create Admin Users for Each Tenant
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('password'),
                'tenant_id' => $tenantRecords[0]->id,
            ],
            [
                'name' => 'Admin 2',
                'email' => 'admin2@gmail.com',
                'password' => bcrypt('password'),
                'tenant_id' => $tenantRecords[1]->id,
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->call(DemoDatabaseSeeder::class);

        // User::factory(10)->create();
    }
}
