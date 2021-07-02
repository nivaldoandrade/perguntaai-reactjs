import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { firebase } from '../services/firebase';

interface User {
	id: string;
	name: string;
	avatar: string;
}

interface AuthContextProviderProps {
	children: ReactNode;
}

interface AuthContextTypes {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
}

export const AuhtContext = createContext({} as AuthContextTypes);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const { uid, displayName, photoURL } = user;

				if (!displayName || !photoURL) {
					throw new Error('Falta o nome ou avatar da conta Google')
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL,
				})
			}
		})

		return () => {
			unsubscribe()
		}
	}, [])

	async function signInWithGoogle() {
		const providerGoogle = new firebase.auth.GoogleAuthProvider();

		const result = await firebase.auth().signInWithPopup(providerGoogle);

		if (result.user) {
			const { uid, displayName, photoURL } = result.user;

			if (!displayName || !photoURL) {
				toast.error('Falta o nome ou avatar da conta Google');
				throw new Error('Falta o nome ou avatar da conta Google')
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL,
			})
		}
	}

	return (
		<AuhtContext.Provider value={{ user, signInWithGoogle }}>
			{children}
		</AuhtContext.Provider>
	);
}


export function useAuth() {
	return useContext(AuhtContext);
}