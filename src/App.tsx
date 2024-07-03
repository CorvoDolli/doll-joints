import _React, { useEffect, useState } from "react";
// import { useTaskStore } from "./db/store";
import { supabase } from "./db/supabaseClient";
import { User } from "@supabase/supabase-js";
import Todo from "./components/todo";

export default function App() {
	// const tasks = useTaskStore((state) => state.tasks);
	// const fetchTasks = useTaskStore((state) => state.fetchTasks);
	// const addTask = useTaskStore((state) => state.subscribeToTasks);

	const [user, setUser] = useState<User>();

	// const handleLogin = async () => {
	// 	// fetchTasks();
	// 	// addTask("hello");
	// 	// console.log(tasks);
	// 	await supabase.auth.signInWithOAuth({ provider: "discord" });
	// };

	useEffect(() => {
		(async () => {
			const session = await supabase.auth.getSession();
			if (session.data.session) {
				setUser(session.data.session.user);
				const { data: authListener } = supabase.auth.onAuthStateChange(
					async (event, session) => {
						switch (event) {
							case "SIGNED_IN":
								setUser(session?.user);
								break;
							case "SIGNED_OUT":
								setUser(undefined);
								break;
							default:
						}
					}
				);
				return () => {
					authListener.subscription.unsubscribe();
				};
			}
		})();
	}, []);

	const login = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "discord",
		});
	};
	// const logout = async () => {
	// 	await supabase.auth.signOut();
	// };

	return (
		<>
			{/* <h1>App</h1>
			{user ? (
				<div>
					<h1>Authenticated</h1>
					<button onClick={logout}>Logout</button>
				</div>
			) : (
				<button onClick={login}>Login with Discord</button>
			)}
      <hr/> */}
			<h1>Auth Test</h1>
			<div>
				{user ? (
					<Todo user={user} />
				) : (
					<button onClick={login}>Login with Discord</button>
				)}
			</div>
		</>
	);
}
