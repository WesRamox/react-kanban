import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Task } from "../entities/Task";
import { tasksService } from "../services/api";

export interface TasksContextData {
  tasks: Task[]
  createTask: (attributes: Omit<Task, "id">) => Promise<void>
  updateTask: (id: string, attributes: Partial<Omit<Task, "id">>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTaskById: (id: string) => Promise<Task>
  editTask: (id: string, attributes: Partial<Omit<Task, "id">>) => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const TasksContext = createContext({} as TasksContextData)

interface TasksContextProviderProps {
  children: ReactNode
}

export const TasksContextProvider: React.FC<TasksContextProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([])
  
    useEffect(() => {
      tasksService.fetchTasks().then((data) => setTasks(data));
    }, [])

    const createTask = async (attributes: Omit<Task, "id">) => {
      const newTask = await tasksService.createTasks(attributes)
      setTasks((currentState) => { 
        const updatedTasks = [...currentState, newTask]
        return updatedTasks
      })
    }

    const updateTask = async (id: string, attributes: Partial<Omit<Task, "id">>) => {
      await tasksService.updateTask(id, attributes)
      setTasks((currentState) => {
        const updatedTasks = [...currentState]
        const taskIndex = updatedTasks.findIndex((task) => task.id === id)
        Object.assign(updatedTasks[taskIndex], attributes)
        return updatedTasks
      })
    }

    const fetchTaskById = async (id: string): Promise<Task> => {
      const task = await tasksService.fetchTaskById(id)
      return task
    }

    const editTask = async (id: string, attributes: Partial<Omit<Task, "id">>) => {
      await tasksService.editTask(id, attributes)
        setTasks((currentState) => {
          const updatedTasks = [...currentState]
          const taskIndex = updatedTasks.findIndex((task) => task.id === id)
          Object.assign(updatedTasks[taskIndex], attributes)
          
          return updatedTasks
      })
    }

    const deleteTask = async(id: string) => {
      await tasksService.deleteTask(id)
      setTasks((currentState) => currentState.filter((task) => task.id !== id))
    }

  return (
    <TasksContext.Provider value={{ tasks, createTask, updateTask, deleteTask, fetchTaskById, editTask }}>
      {children}
    </TasksContext.Provider>
  )
}