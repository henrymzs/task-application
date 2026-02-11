import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface Task {
    readonly id: string;
    title: string,
    description: string,
    completed: boolean,
    readonly createdAt: string
}

interface TaskUpdate {
    title?: string,
    description?: string,
    completed?: boolean
}

interface TaskContextType {
    tasks: Task[];
    addTask: (data: { title: string; description: string }) => void;
    updateTask: (id: string, updates: TaskUpdate) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;
    getTask: (id: string) => Task | undefined;
}

type TaskProviderProps = {
    children: React.ReactNode;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = "todo-tasks";

function loadTasks(): Task[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed;
    } catch (error) {
        return [];
    }
}

export function TaskProvider({ children }: TaskProviderProps) {
    const [tasks, setTasks] = useState<Task[]>(loadTasks);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const addTask = useCallback((data: { title: string; description: string }) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setTasks(prev => [newTask, ...prev]);
    }, []);

    const updateTask = useCallback((id: string, updates: TaskUpdate) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    const toggleTask = useCallback((id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }, []);

    // const getTask = (id: string) => {
    //     return tasks.find(t => t.id === id);
    // };

    const getTask = useCallback((id: string) => {
        return tasks.find(t => t.id === id);
    }, [tasks]);

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask, getTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within a TaskProvider');
    return context;
};
