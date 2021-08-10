import { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/useAuth';

import { Button } from '../../components/Button';

import { firebase } from '../../services/firebase';

import IllustrationImg from '../../assets/images/illustration.svg';
import LogoImg from '../../assets/images/logo.svg';
import LogoGoogleImg from '../../assets/images/logo-google.svg';

import styles from './Styles.module.scss';

interface FirebaseRoom {
	[key: string]: {
		adminRoomId: string;
		name: string;
		questions: Object;
		roomCode: number;
	}
}

export default function Home() {
	const { user, signInWithGoogle } = useAuth();
	const history = useHistory();

	const [roomCode, setRoomCode] = useState('');

	useEffect(() => {
		document.title = "Pergunta aí - Inicio";
	}, [])

	async function navigateToCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}

		history.push('/rooms/news');
	}

	function handleEnterRoom(e: FormEvent) {
		e.preventDefault();

		const roomRef = firebase.database().ref('rooms');
		const roomCodeFormatted = roomCode.trim();

		if (!roomCodeFormatted) {
			toast.info('Por favor, digite código da sala.')
			return;
		}

		roomRef.once('value', (snapshot) => {
			const roomsVal: FirebaseRoom = snapshot.val();

			const room = Object.entries(roomsVal || {}).find(
				([, value]) => value.roomCode === Number(roomCodeFormatted)
			)

			if (room?.[0]) {
				if (room?.[1].adminRoomId === user?.id) {
					history.push(`/adminrooms/${room[0]}`)
				} else {
					history.push(`/rooms/${room[0]}`)
				}
			} else {
				toast.error('Código errado ou sala não existe')
			}
		})
	}

	return (
		<div className={styles.pageAuth}>
			<aside>
				<img src={IllustrationImg} alt="ilustração" />
				<h1>Toda pergunta tem uma resposta.</h1>
				<p>Conhecimento só ganha valor quando é compartilhado.</p>
			</aside>
			<main>
				<div className={styles.mainContent}>
					<img src={LogoImg} alt="letmeask" />
					<button
						className={styles.btnGoogle}
						onClick={navigateToCreateRoom}
					>

						<img src={LogoGoogleImg} alt="Logo Google" />
						Crie sua sala com o Google
					</button>
					<div className={styles.divider}>ou entra em uma sala</div>
					<form
						className={styles.enterRoom}
						onSubmit={handleEnterRoom}
					>
						<input
							type="number"
							name="room"
							placeholder="Digite o código da sala"
							onChange={e => setRoomCode(e.target.value)}
							value={roomCode}
						/>
						<Button icon={FiLogIn} backgroundColor="#835AFD">
							Entra na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}