<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $students = Student::where('tenant_id', $tenantId)->get();

        return Inertia::render('student/index', [
            'students'=>$students,
            'tenant_id'=>$tenantId,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'=>'required|string|max:50',
            'last_name'=>'required|string|max:50',
            'grade'=>'required|string',
        ]);

        $validated['tenant_id']= Auth::user()->tenant_id;

        Student::create($validated);

        return Redirect::route('students.index')->with('success', 'Student created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name'=>'required|string|max:50',
            'last_name'=>'required|string|max:50',
            'grade'=>'required|string',
        ]);

        $student = Student::where('id', $id)->where('tenant_id', Auth::user()->tenant_id)->firstOrFail();
        $student->update($validated);
        return Redirect::route('students.index')->with('success', 'Student created successfully.');
    }

    public function destroy($id)
    {
        $student = Student::where("tenant_id", Auth::user()->tenant_id)->findOrFail($id);
        $student->delete();
        return Redirect::route('students.index')->with('success', 'Student created successfully.');
    }


}
