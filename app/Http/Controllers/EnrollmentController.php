<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
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
        $courses = Course::where('tenant_id', $tenantId)->get(['id', 'course_name', 'description']);

        return Inertia::render('enrollment/index', [
            'tenant_id' => $tenantId,
            'enrollments'=> $enrollments,
            'students'=>$students,
            'courses' => $courses,
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

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Enrollment::create($validated);
        return Redirect::route('enrollments.index')->with('success', 'The student successfully enrolled to the course.');
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
