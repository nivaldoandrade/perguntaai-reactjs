import { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';

import { useAuth } from '../../hooks/useAuth';

import { firebase } from '../../services/firebase';

import { generateRoomCode } from '../../utils/gerenateRoomCode';

import IllustrationImg from '../../assets/images/illustration.svg';
import LogoImg from '../../assets/images/logo.svg';

import styles from './Styles.module.scss';

export default function CreateRooms() {
	const history = useHistory();
	const { user } = useAuth();

	const [newRoom, setNewRoom] = useState('');

	useEffect(() => {
		document.title = "Pergunta aí - Criação da Sala"
		if (!user) {
			history.replace('/');
		}
	}, [user, history])

	async function handleCreateRoom(e: FormEvent) {
		e.preventDefault();

		const nameRoomFormatted = newRoom.trim();

		if (!nameRoomFormatted) {
			toast.info('Por favor, digite o nome da sala.')
			return;
		}

		const roomRef = firebase.database().ref('rooms');

		let roomCode = generateRoomCode();

		const arrayRoomCode = [] as number[];

		await roomRef.once('value', (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				arrayRoomCode.push(childSnapshot.val().roomCode);
			})
		});

		if (arrayRoomCode.includes(roomCode)) {
			roomCode = generateRoomCode(arrayRoomCode);
		}

		const { key: roomKey } = await roomRef.push({
			roomCode,
			name: nameRoomFormatted,
			adminRoomId: user?.id
		})

		history.push(`/adminrooms/${roomKey}`)
	}

	return (
		<div className={styles.pageCreateRoom}>
			<main>
				<div className={styles.mainContent}>
					<img src={LogoImg} alt="letmeask" />
					<strong>Crie uma nova sala</strong>
					<form className={styles.createRoom}>
						<input
							type="text"
							name="room"
							id="romm"
							placeholder="Nome da sala"
							onChange={e => setNewRoom(e.target.value)}
						/>
						<Button
							backgroundColor="#835AFD"
							onClick={handleCreateRoom}
						>
							Criar sala
						</Button>
					</form>
					<p>
						Quer entrar em uma sala já existente?
						<Link to="/">Clique aqui</Link>
					</p>
				</div>
			</main>
			<aside>
				<img src={IllustrationImg} alt="ilustração" />
				<h1>Borá criar uma sala?</h1>
				<p>Aquele que não compartilha seu conhecimento, deixa morrer consigo os frutos de sua sabedoria.</p>
			</aside>
		</div>
	);
}