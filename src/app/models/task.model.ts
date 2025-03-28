export interface MyTask {
    id: number;
    title: string;
    description: string;
    student_id: number;
    confirmed: number;
    schedule_id?: number;
    schedule_date?: any;
};