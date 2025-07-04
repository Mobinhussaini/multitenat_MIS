import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CourseType } from '@/types/course';
import { TeacherType } from '@/types/teacher';
import { router, usePage } from '@inertiajs/react';
import { Edit, Loader, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

const emptyForm = { course_name: '', description: '' };
type FormState = typeof emptyForm & { id?: number; tenant_id?: number; teacher_id?: string };

const CourseList = () => {
    const { auth, courses, teachers } = usePage<{
        auth: { user: { tenant_id: number } };
        courses?: CourseType[];
        teachers?: TeacherType[];
    }>().props;

    const coursesList = courses ?? [];
    const teachersList = Array.isArray(teachers) ? teachers:  [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenAdd = () => {
        setForm({
            ...emptyForm,
            tenant_id: auth.user.tenant_id, // ✅ Add this line tenant_id
        });
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (course: CourseType) => {
        setLoading(true);
        try {
            setForm({
                id: course.id,
                course_name: course.course_name,
                description: course.description,
                teacher_id: course.teacher_id,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit && form.id) {
                // Update course
                router.put(`/courses/${form.id}`, form, {
                    onSuccess: handleClose,
                });
            } else {
                // Add new course
                router.post('/courses', form, {
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
            if (window.confirm('Are you sure you want to delete this course?')) {
                router.delete(`/courses/${id}`, {
                    onSuccess: () => {
                        // Optionally, you can show a success message or refresh the page
                        console.log('Course deleted successfully');
                    },
                });
            }
        } catch (error) {
            console.log('SOMETHING WENT WONRG:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Courses</h1>
                    <Button onClick={handleOpenAdd} className="hover:cursor-pointer">
                        Add New Course
                    </Button>
                </div>
                <div className="overflow-x-auto"></div>
                <table className="min-w-full rounded-l-2xl border text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Course Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Course Description</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Teacher</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coursesList.length > 0 ? (
                            coursesList.map((course) => (
                                    <tr key={course.id} className="border-b hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">{course.id}</td>
                                        <td className="px-6 py-4">{course.course_name}</td>
                                        <td className="px-6 py-4">{course.description}</td>
                                        <td className="px-6 py-4">
                                            {teachersList.find((teacher) => Number(teacher.id) === Number(course.teacher_id))?.first_name}{' '}
                                            {teachersList.find((teacher) => Number(teacher.id) === Number(course.teacher_id))?.last_name}
                                        </td>

                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:cursor-pointer"
                                                onClick={() => handleOpenEdit(course)}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="ml-2 hover:cursor-pointer"
                                                onClick={() => handleDelete(Number(course.id))}
                                            >
                                                <X size={24} />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )
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
                        <DialogTitle>{isEdit ? 'Update Course' : 'Add New Course'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="course_name">Course Name</Label>
                            <Input
                                disabled={loading}
                                id="course_name"
                                name="course_name"
                                type="text"
                                required
                                value={form.course_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Course Description</Label>
                            <Textarea
                                disabled={loading}
                                id="description"
                                name="description"
                                required
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="teacher_id">Teacher </Label>
                            <Select value={form.teacher_id} onValueChange={(value) => setForm({ ...form, teacher_id: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachersList.map((teacher) => (
                                        <SelectItem value={String(teacher.id)}>{teacher.first_name + ' ' + teacher.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                {isEdit ? 'Update Student' : 'Add Student'}
                                {loading && <Loader />}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default CourseList;
