import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CourseType } from '@/types/course';
import { EnrollmentType } from '@/types/enrollment';
import { StudentType } from '@/types/student';
import { TeacherType } from '@/types/teacher';
import { router, usePage } from '@inertiajs/react';
import { Edit, Loader, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/enrollments',
    },
];

const emptyForm = { student_id: '', course_id: '', enrollment_date: '', teacher_id: '' };
type FormState = typeof emptyForm & { id?: number };

const EnrollmentList = () => {
    const { auth, enrollments, students, courses, teachers } = usePage<{
        auth: { user: { tenant_id: number } };
        enrollments?: EnrollmentType[];
        students?: StudentType[];
        courses?: CourseType[];
        teachers?: TeacherType[];
    }>().props;

    const enrollmentsList = enrollments ?? [];
    const studentsList = students ?? [];
    const coursesList = courses ?? [];
    const teachersList = teachers ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (enrollment: EnrollmentType) => {
        setLoading(true);
        try {
            const selectedCourse = coursesList.find((course) => course.id === enrollment.course_id);
            const teacherId = selectedCourse?.teacher_id ?? '';
            setForm({
                id: enrollment.id,
                student_id: String(enrollment.student_id),
                course_id: String(enrollment.course_id),
                teacher_id: String(teacherId),
                enrollment_date: enrollment.enrollment_date,
            });
            setIsEdit(true);
            setOpen(true);
        } catch (error) {
            console.log('SOMETHING WENT WONRG:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            student_id: Number(form.student_id),
            course_id: Number(form.course_id),
        };
        try {
            setLoading(true);

            const duplicate = enrollmentsList.some(
                (e) => e.course_id === Number(form.course_id) && e.student_id === Number(form.student_id) && (!isEdit || e.id !== form.id),
            );

            if (duplicate) {
                alert('This student is already enrolled in the selected course.');
                return;
            }
            if (isEdit && form.id) {
                // Update enrollment
                router.put(`/enrollments/${form.id}`, payload, {
                    onSuccess: handleClose,
                });
            } else {
                // Add new enrollment
                router.post('/enrollments', payload, {
                    onSuccess: handleClose,
                });
            }
        } catch (error) {
            console.log('SOMETHING WENT WONRG:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        try {
            setLoading(true);
            if (window.confirm('Are you sure you want to delete this enrollment?')) {
                router.delete(`/enrollments/${id}`, {
                    onSuccess: () => {
                        // Optionally, you can show a success message or refresh the page
                        console.log('Enrollment deleted successfully');
                    },
                });
            }
        } catch (error) {
            console.log('SOMETHING WENT WONRG:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStudentName = (student_id: number) => {
        const student = studentsList.find((student) => student.id === student_id);
        return student ? `${student.first_name} ${student.last_name}` : student_id;
    };

    const getCourseName = (id: number) => {
        const course = coursesList.find((course) => course.id === id);
        return course ? course.course_name : `Course ID: ${id}`;
    };

    const getTeacherNameByCourseId = (courseId: number) => {
        const course = coursesList.find((c) => c.id === courseId);
        if (!course) return 'Unknown Course';
        const teacher = teachersList.find((t) => t.id === Number(course.teacher_id));
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Courses</h1>
                    <Button onClick={handleOpenAdd} className="hover:cursor-pointer">
                        Add New Enrollment
                    </Button>
                </div>
                <div className="overflow-x-auto"></div>
                <table className="min-w-full rounded-l-2xl border text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Enrollment Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollmentsList.length > 0 ? (
                            enrollmentsList.map((enrollment) => {
                                return (
                                    <tr key={enrollment.id} className="border-b hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">{enrollment.id}</td>
                                        <td className="px-6 py-4">{getStudentName(enrollment.student_id)}</td>
                                        <td className="px-6 py-4">
                                            {getCourseName(enrollment.course_id)}
                                            <span className="text-xs flex text-muted-foreground">
                                                {getTeacherNameByCourseId(enrollment.course_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{enrollment.enrollment_date}</td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:cursor-pointer"
                                                onClick={() => handleOpenEdit(enrollment)}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="ml-2 hover:cursor-pointer"
                                                onClick={() => handleDelete(Number(enrollment.id))}
                                            >
                                                <X size={24} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Oops! No Course Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Enrollment' : 'Add New Enrollment'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="student_id">Student </Label>
                            <Select value={form.student_id} onValueChange={(value) => setForm({ ...form, student_id: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentsList.map((student) => (
                                        <SelectItem value={String(student.id)}>{student.first_name + ' ' + student.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="course_id">Course </Label>
                            <Select
                                value={form.course_id}
                                onValueChange={(value) => {
                                    const selectedCourse = coursesList.find((c) => c.id === Number(value));
                                    const teacherId = selectedCourse?.teacher_id ?? '';
                                    setForm({
                                        ...form,
                                        course_id: value,
                                        teacher_id: teacherId,
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {coursesList.map((course) => (
                                        <>
                                            <SelectItem key={course.id} value={String(course.id)}>
                                                <div className="mx-auto flex items-center justify-between gap-x-12">
                                                    <span>{course.course_name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {getTeacherNameByCourseId(Number(course.teacher_id))}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        </>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="enrollment_date">Enrollment Date </Label>
                            <Input
                                id="enrollment_date"
                                name="enrollment_date"
                                type="date"
                                value={form.enrollment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                type="button"
                                className="flex flex-row justify-between"
                                disabled={loading}
                                onClick={handleClose}
                            >
                                Cancel
                                {loading && <Loader />}
                            </Button>
                            <Button type="submit" className="flex flex-row justify-between" variant="default" disabled={loading}>
                                {isEdit ? 'Update Enrollment' : 'Add Enrollment'}
                                {loading && <Loader />}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default EnrollmentList;
