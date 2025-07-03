export interface CourseType {
    id: number;
    tenant_id: string;
    course_name: string; // 100
    description: string; // nullable
    teacher_id: string;
}
