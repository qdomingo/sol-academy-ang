export interface Payment {
    schecule_id: number;
    student_id: number;
    title: string;
    inicio: string;
    fin: string;
    duration: number;  
    paid: number;
    rate: number;
    serie_id?: number;
    outdated?: boolean;
    inicioZ?: string;
    finZ?: string;
    schedule_month?: number;
    schedule_year?: number;
};