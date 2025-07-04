<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $enrollments = Enrollment::where('tenant_id', $tenantId)->get();
        $students = Student::where('tenant_id', $tenantId)->get(['id', 'first_name', 'last_name']);
        $courses = Course::where('tenant_id', $tenantId)->get(['id', 'course_name', 'teacher_id', 'description']);
        $teachers = Teacher::where('tenant_id', $tenantId)->get(['id', 'first_name', 'last_name']);

        return Inertia::render('enrollment/index', [
            'enrollments' => $enrollments,
            'tenant_id' => $tenantId,
            'students' => $students,
            'courses' => $courses,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer',
            'student_id' => 'required|integer',
            'teacher_id' => 'required|integer',
            'enrollment_date' => 'required|date',
        ]);

        $tenantId = Auth::user()->tenant_id;

        $exists = Enrollment::where('tenant_id', $tenantId)
            ->where('course_id', $validated['course_id'])
            ->where('student_id', $validated['student_id'])
            ->exists();

        if ($exists) {
            return Redirect::route('enrollments.index')->withErrors([
                'student_id' => 'This student is already enrolled in the selected course.',
            ]);
        }

        $validated['tenant_id'] = $tenantId;
        Enrollment::create($validated);

        return Redirect::route('enrollments.index')->with('success', 'Student successfully enrolled.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer',
            'student_id' => 'required|integer',
            'teacher_id' => 'required|integer',
            'enrollment_date' => 'required|date',
        ]);

        $enrollment = Enrollment::where('tenant_id', Auth::user()->tenant_id)
            ->findOrFail($id);

        $enrollment->update($validated);
        return Redirect::route('enrollments.index')->with('success', 'The enrollment of the student has been updated successfully.');
    }

    public function destroy($id)
    {
        $enrollment = Enrollment::where('tenant_id', Auth::user()->tenant_id)
            ->findOrFail($id);
        $enrollment->delete();

        return Redirect::route('enrollments.index')->with('success', 'The enrollment has been deleted successfully.');
    }
}
