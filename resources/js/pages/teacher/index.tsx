import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TeacherType } from '@/types/teacher';
import { router, usePage } from '@inertiajs/react';
import { Edit, Loader, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teachers',
        href: '/teachers',
    },
];

// type FormState = typeof emptyForm & { id?: number };
type FormState = typeof emptyForm & { id?: number; tenant_id?: number };

const emptyForm = { first_name: '', last_name: '', subject: '' };

const TeacherList = () => {
    const { auth, teachers } = usePage<{
        auth: { user: { tenant_id: number } };
        teachers?: TeacherType[];
    }>().props;

    const teachersList = teachers ?? [];

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

    const handleOpenEdit = (teacher: TeacherType) => {
        setLoading(true);
        try {
            setForm({
                id: teacher.id,
                first_name: teacher.first_name,
                last_name: teacher.last_name,
                subject: teacher.subject,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit && form.id) {
                // Update teacher
                router.put(`/teachers/${form.id}`, form, {
                    onSuccess: handleClose,
                });
            } else {
                // Add new teacher
                router.post('/teachers', form, {
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
            if (window.confirm('Are you sure you want to delete this teacher?')) {
                router.delete(`/teachers/${id}`, {
                    onSuccess: () => {
                        // Optionally, you can show a success message or refresh the page
                        console.log('Teacher deleted successfully');
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
                    <h1 className="text-2xl font-semibold">Teachers</h1>
                    <Button onClick={handleOpenAdd} className="hover:cursor-pointer">
                        Add New Teacher
                    </Button>
                </div>
                <div className="overflow-x-auto"></div>
                <table className="min-w-full rounded-l-2xl border text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachersList.length > 0 ? (
                            teachersList.map((teacher) => {
                                {
                                    /* { teacherList.length>0 ? teacherList.map((teacher) => { */
                                }
                                return (
                                    <tr key={teacher.id} className="border-b hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">{teacher.id}</td>
                                        <td className="px-6 py-4">{teacher.first_name}</td>
                                        <td className="px-6 py-4">{teacher.last_name}</td>
                                        <td className="px-6 py-4">{teacher.subject}</td>

                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:cursor-pointer"
                                                onClick={() => handleOpenEdit(teacher)}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="ml-2 hover:cursor-pointer"
                                                onClick={() => handleDelete(Number(teacher.id))}
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
                                    No teachers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Teacher' : 'Add New Teacher'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                disabled={loading}
                                id="first_name"
                                name="first_name"
                                type="text"
                                required
                                value={form.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                disabled={loading}
                                id="last_name"
                                name="last_name"
                                type="text"
                                required
                                value={form.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input disabled={loading} id="subject" name="subject" type="text" required value={form.subject} onChange={handleChange} />
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
                                {isEdit ? 'Update Teacher' : 'Add Teacher'}
                                {loading && <Loader />}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default TeacherList;
