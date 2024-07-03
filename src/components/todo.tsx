import _React, { useEffect, useRef, useState } from "react";
import { supabase } from "../db/supabaseClient";
import { PostgrestError, User } from "@supabase/supabase-js";

interface ToDoItem {
	id: string;
	title: string;
	created_at: string;
	complete: boolean;
	user_id: string;
}

export default function Todo({ user }: { user: User }) {
	const [todo, setTodo] = useState<ToDoItem[]>([]);
	const [error, setError] = useState<PostgrestError>();
	const inputRef = useRef<HTMLInputElement>(null);

	const logout = async () => {
		await supabase.auth.signOut();
	};

	const getTodo = async () => {
		const res = await supabase.from("todo").select("*");
		setTodo(res.data as ToDoItem[]);
		setError(res.error as PostgrestError);
	};

	const handleCreateTodo = async () => {
		const title = inputRef.current ? inputRef.current.value : "";

		const res = await supabase
			.from("todo")
			.insert({ title, user_id: user.id })
			.select("*")
			.single();

		if (inputRef.current) {
			inputRef.current.value = "";
		}

		if (res.data) {
			setTodo((currentTodo) => [...currentTodo, res.data]);
		}
		if (res.error) {
			setError(res.error);
		}
	};

	const handleCompleteTodo = async (id: string) => {
		const res = await supabase
			.from("todo")
			.update({ complete: true })
			.eq("id", id)
			.select()
			.single();

		if (!res.error) {
			setTodo((currentTodo) =>
				currentTodo.map((todo) => {
					if (todo.id === id) {
						todo.complete = true;
					}
					return todo;
				})
			);
		}
		if (res.error) {
			setError(res.error);
		}
	};

	const handleDelete = async (id: string) => {
		const res = await supabase.from("todo").delete().eq("id", id);
		console.log(res);
		if (!res.error) {
			setTodo((currentTodo) => currentTodo.filter((todo) => todo.id !== id));
		}

		if (res.error) {
			setError(res.error);
		}
	};

	useEffect(() => {
		getTodo();
	}, []);

	return (
		<div>
			<div>
				<h2>List of Todos</h2>
				<div>
					<input ref={inputRef} />
					<button onClick={handleCreateTodo}>add</button>
					{error && <pre>{error.message}</pre>}
				</div>
				{todo &&
					todo.map((value, index) => {
						return (
							<div key={index}>
								<div
									style={{
										textDecoration: value.complete ? "line-through" : "",
									}}>
									{value.title}
								</div>
								<button onClick={() => handleCompleteTodo(value.id)}>
									complete
								</button>
								<button onClick={() => handleDelete(value.id)}>Delete</button>
								<hr />
							</div>
						);
					})}

				<button onClick={logout}>Logout</button>
			</div>
		</div>
	);
}
