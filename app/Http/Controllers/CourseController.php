<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CourseController extends Controller
{
    // List of Courses function
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $courses = Course::where('tenant_id', $tenantId)->get();
        $teachers = Teacher::where('tenant_id', $tenantId)->paginate(10);

        return Inertia::render('course/index', [
            'tenant_id' => $tenantId,
            'courses' => $courses,
            'teachers' => $teachers,
        ]);
    }

    // Create New Course Function;
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:100',
            'teacher_id' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Course::create($validated);
        return Redirect::route('courses.index')->with('success', 'Course created successfully.');
    }

    // Update New Course Function;
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:100',
            'teacher_id' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $course = Course::where('id', $id)->where('tenant_id', Auth::user()->tenant_id)->firstOrFail();
        $course->update($validated);

        return Redirect::route('courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy($id)
    {
        $course = Course::where('id', $id)->where('tenant_id', Auth::user()->tenant_id)->firstOrFail();

        $course->delete();

        return Redirect::route('courses.index')->with('success', 'Course deleted successfully!');
    }
}
