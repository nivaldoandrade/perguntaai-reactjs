import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiMessageSquare, FiTrash } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { firebase } from '../../services/firebase';

import { Header } from '../../components/Header/';
import { Question } from '../../components/Question/';
import { ModalQuestion } from '../../components/Modal/ModalQuestion';


import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';


import NoneQuestionImg from '../../assets/images/noneQuestion.svg';
import LogoImg from '../../assets/images/logo.svg';

import styles from './Styles.module.scss';

interface ParamsRoom {
	id: string;
}

export default function AdminRooms() {
	const { user } = useAuth();
	const { id } = useParams<ParamsRoom>();
	const { isLoading, questions, room } = useRoom(id);
	const history = useHistory();

	const [modalOpen, setModalOpen] = useState(false);
	const [removeQuestionID, setRemoveQuestionID] = useState('');

	useEffect(() => {
		document.title = `Pergunta aí - Sala Admin`
	}, [])

	useEffect(() => {
		if (!isLoading && user?.id !== room?.adminRoomID) {
			history.replace(`/rooms/${id}`)
		}
		return () => {
		}
	}, [user?.id, room?.adminRoomID, history, isLoading, id])


	function handleIsHighlighted(questionID: string, currentHighligth: boolean) {
		const questionRef = firebase.database().ref(`rooms/${id}/questions/${questionID}`);

		questionRef.update({
			isHighlighted: !currentHighligth
		})
	}

	function handleIsAnswered(questionID: string, currentAnswer: boolean) {
		const questionRef = firebase.database().ref(`rooms/${id}/questions/${questionID}`);

		questionRef.update({
			isAnswered: !currentAnswer
		})
	}

	async function handleDeleteQuestion() {
		const questionRef = firebase.database().ref(`rooms/${id}/questions/${removeQuestionID}`);

		if (room?.adminRoomID === user?.id) {
			await questionRef.remove();
		}

		toggleModal();
	}

	function saveQuestionRemoveAndToggleModal(questionID: string) {
		setRemoveQuestionID(questionID);
		toggleModal();
	}

	function toggleModal() {
		setModalOpen(state => !state);
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
			<Header
				roomID={id}
				roomCode={room?.roomCode}
				isAdminRoom={user?.id === room?.adminRoomID}
			/>
			<main className={styles.adminRooms}>
				<div className={styles.roomsContent}>
					<div className={styles.roomsHeader}>
						<h1>Sala - {room?.name}</h1>
						{(questions && questions?.length > 0) && (
							<span>{questions?.length} pergunta(s)</span>
						)}
					</div>
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
									<button
										onClick={
											() => handleIsAnswered(question.id, question.isAnswered)
										}
									>
										<FiCheckCircle size={18} color={question.isAnswered ? '#835AFD' : ''} />
									</button>
									<button
										onClick={
											() => handleIsHighlighted(question.id, question.isHighlighted)
										}
									>
										<FiMessageSquare size={18} color={question.isHighlighted ? '#835AFD' : ''} />
									</button>
									<button onClick={() => saveQuestionRemoveAndToggleModal(question.id)}>
										<FiTrash size={18} />
									</button>
								</Question>
							))}
						</section>
					)}
				</div>
				<ModalQuestion isOpen={modalOpen} setIsOpen={toggleModal} removeQuestion={handleDeleteQuestion} />
			</main>
		</>
	)
}






