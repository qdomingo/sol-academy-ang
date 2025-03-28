export interface Schedule {
    id: number;
    title: string;
    inicio: string;
    fin: string;
    student_id?: number;
    weekly?: number;
    serie_id?: number;
    task_id?: number;
    outdated?: boolean;
    schedule_month?: number;
    schedule_year?: number;
};