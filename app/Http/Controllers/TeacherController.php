<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $teachers = Teacher::where('tenant_id', $tenantId)->get();

        return Inertia::render('teacher/index', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Teacher::create($validated);
        return Redirect::route('teachers.index')->with('success', 'Teacher created successfully.');

    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);

        $teacher = Teacher::where('id', $id)
                    ->where('tenant_id', Auth::user()->tenant_id)
                    ->firstOrFail();

        $teacher->update($validated);
        return Redirect::route('teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $teacher = Teacher::where('tenant_id', Auth::user()->tenant_id)
            ->findOrFail($id);
        $teacher->delete();

        return Redirect::route('teachers.index')->with('success', 'Teacher deleted successfully.');
    }

}
