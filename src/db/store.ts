import { create } from "zustand";
import { supabase } from "./supabaseClient";

interface TaskStore {
	tasks: string[];
	fetchTasks: () => Promise<void>;
	subscribeToTasks: (newTask: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
	tasks: [],
	fetchTasks: async () => {
		const { data } = await supabase.from("tasks").select("*");
		if (data) {
			set({ tasks: data });
		}
	},
	subscribeToTasks: async (newTask: string) => {
		await supabase.from("tasks").insert(() => {
			set((state: { tasks: any }) => ({
				tasks: [...state.tasks, newTask],
			}));
		});
	},
}));
