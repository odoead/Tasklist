import { Task } from './Task';

export interface TaskList {
  id: number;
  name: string;
  tasks: Task[];
}
