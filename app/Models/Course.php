<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'course_name',
        'teacher_id',
        'description',
    ];

    protected $casts = [
        'tenant_id' => 'integer',
        'teacher_id' => 'integer',
    ];


    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
