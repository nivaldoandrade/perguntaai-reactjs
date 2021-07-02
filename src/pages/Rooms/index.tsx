import { FormEvent, useEffect, useState } from 'react';
import { firebase } from '../../services/firebase';
import { useParams } from 'react-router-dom';
import { FiThumbsUp } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header/';
import { Question } from '../../components/Question/';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';


import NoneQuestionImg from '../../assets/images/noneQuestion.svg';
import LogoImg from '../../assets/images/logo.svg';

import styles from './Styles.module.scss';

interface ParamsRoom {
	id: string;
}

export default function Rooms() {
	const { user, signInWithGoogle } = useAuth();
	const { id } = useParams<ParamsRoom>();
	const { isLoading, questions, room } = useRoom(id);

	const [newQuestion, setNewQuestion] = useState('');

	useEffect(() => {
		document.title = `Pergunta aí - ${room?.roomCode ?? '...'}`
	}, [room?.roomCode])

	async function handleCreateQuestion(e: FormEvent) {
		e.preventDefault();

		const newQuestionFormatted = newQuestion.trim();

		if (!newQuestionFormatted) {
			toast.info('Por favor, digite a pergunta.')
			return;
		}

		if (!user) {
			toast.error('É necessário está logado');
			return;
		}

		const roomRef = firebase.database().ref('rooms').child(id);

		await roomRef.child('questions').push({
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			isHighlighted: false,
			isAnswered: false
		});

		setNewQuestion('');
	}

	async function handleLikeQuestion(questionID: string, likeID: string | undefined) {
		const roomRef = firebase.database().ref(`/rooms/${id}/questions/${questionID}/likes`);

		if (likeID) {
			await roomRef.child(likeID).remove()
		} else {
			await roomRef.push(user?.id);
		}
	}

	if (isLoading) {
		return (
			<div
				style={{
					width: '100%',
					height: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<img src={LogoImg} alt="letmeask" />
			</div>
		)
	}

	return (
		<>
			<Header roomCode={room?.roomCode} />
			<main className={styles.rooms}>
				<div className={styles.roomsContent}>
					<div className={styles.roomsHeader}>
						<h1>Sala - {room?.name}</h1>
						{(questions && questions?.length > 0) && (
							<span>{questions?.length} pergunta(s)</span>
						)}
					</div>
					<form onSubmit={handleCreateQuestion}>
						<textarea
							placeholder="O que voce quer perguntar?"
							value={newQuestion}
							onChange={e => setNewQuestion(e.target.value)}
						/>
						<div className={styles.formFooter}>
							{user
								? (
									<div>
										<img src={user.avatar} alt={user.avatar} />
										<p>{user.name}</p>
									</div>
								)
								: (
									<p>
										Para enviar uma pergunta,
										<button type="button" onClick={signInWithGoogle}>
											faça seu login
										</button>
									</p>
								)
							}
							<Button disabled={!user ?? true}>Enviar pergunta</Button>
						</div>
					</form>
					{!questions ? (
						<section className={styles.noneQuestion}>
							<img src={NoneQuestionImg} alt="question" />
							<strong>Nenhuma pergunta por aqui...</strong>
							<p>Faça o seu login e seja a primeira pessoas a fazer uma pergunta!</p>
						</section>
					) : (
						<section className={styles.questionsList}>
							{questions.map(question => (
								<Question key={question.id} question={question}>
									{question.likesCount > 0 && question.likesCount}
									<button
										disabled={!user}
										onClick={() => handleLikeQuestion(question.id, question.likeID)}
									>
										<FiThumbsUp size={24} color={question.likeID ? '#835AFD' : ''} />
									</button>
								</Question>
							))}
						</section>
					)}
				</div>
			</main>
		</>
	)
}






