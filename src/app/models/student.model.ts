import { MyTask } from './task.model';

export interface Student {
    id: number;
    nickname: string;
    name: string;
    email: string;
    comments: string;
    tasks: MyTask[];
    rate?: number;
};
    