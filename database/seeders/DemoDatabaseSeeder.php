<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Teacher;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class DemoDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Loop through both tenant IDs
        foreach ([1, 2] as $tenantId) {
            // Define static data per tenant
            $grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

            $subjects = [
                'Artificial Intelligence',
                'Object Oriented Programming',
                'HTML & CSS',
                'Advanced ReactJS',
                'Java Advanced',
                'Computer Architecture',
            ];

            // 1. Create Teachers
            $teachers = collect();
            for ($i = 0; $i < 12; $i++) {
                $teachers->push(Teacher::create([
                    'first_name' => $faker->firstName,
                    'last_name' => $faker->lastName,
                    'subject' => $faker->randomElement($subjects),
                    'tenant_id' => $tenantId,
                ]));
            }

            // 2. Create Courses
            $courses = collect();
            for ($i = 1; $i <= 15; $i++) {  // 15 courses per tenant (total = 30)
                $teacher = $teachers->random();
                $courses->push(Course::create([
                    'course_name' => $faker->words(3, true),
                    'description' => $faker->sentence,
                    'teacher_id' => $teacher->id,
                    'tenant_id' => $tenantId,
                ]));
            }

            // 3. Create Students with random grades
            $students = collect();
            for ($i = 0; $i < 125; $i++) {  // 125 students per tenant (total = 250)
                $students->push(Student::create([
                    'first_name' => $faker->firstName,
                    'last_name' => $faker->lastName,
                    'grade' => $faker->randomElement($grades),
                    'tenant_id' => $tenantId,
                ]));
            }

            // 4. Enroll each student in 1–5 random courses
            foreach ($students as $student) {
                $randomCourses = $courses->random(rand(1, 5));
                foreach ($randomCourses as $course) {
                    Enrollment::firstOrCreate([
                        'student_id' => $student->id,
                        'course_id' => $course->id,
                        'teacher_id' => $course->teacher_id,
                        'tenant_id' => $tenantId,
                        'enrollment_date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                    ]);
                }
            }

            $this->command->info("✅ Seeded demo data for tenant ID: {$tenantId}");
        }

        $this->command->info('🎉 All tenants have been seeded successfully.');
    }
}
