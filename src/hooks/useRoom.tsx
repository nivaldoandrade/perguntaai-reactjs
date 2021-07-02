import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';


import { firebase } from '../services/firebase';
import { useAuth } from './useAuth';

interface FirebaseQuestions {
	[key: string]: {
		author: {
			name: string;
			avatar: string;
		}
		content: string;
		isHighlighted: boolean;
		isAnswered: boolean;
		likes: {
			[key: string]: string;
		}
	}
}

interface Question {
	id: string;
	author: {
		name: string;
		avatar: string;
	}
	content: string;
	isHighlighted: boolean;
	isAnswered: boolean;
	likeID: string | undefined;
	likesCount: number;
}

interface Room {
	adminRoomID: string;
	name: string;
	roomCode: number;
}

export function useRoom(roomID: string) {
	const { user } = useAuth();
	const history = useHistory();

	const [room, setRoom] = useState<Room>();
	const [questions, setQuestions] = useState<Question[]>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const roomRef = firebase.database().ref(`/rooms/${roomID}`);


		roomRef.on('value', (snapshot) => {
			if (!snapshot.val()) {
				history.replace('/');
				toast.info('Sala foi encerrada/não existe.')
				return;
			}

			const questionsVal: FirebaseQuestions = snapshot.child('questions').val();

			const questions = Object.entries(questionsVal || {}).map(([key, value]) => {
				let likeID: string | undefined;
				let likesCount = 0;

				if (value.likes && user?.id) {
					likeID = Object.entries(value.likes).find(([, userID]) => userID === user.id)?.[0];
					likesCount = Object.values(value.likes).length;
				}

				return {
					id: key,
					content: value.content,
					author: {
						name: value.author.name,
						avatar: value.author.avatar,
					},
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
					likeID,
					likesCount,
				}
			})

			setQuestions(questions);
			setRoom({
				adminRoomID: snapshot.val().adminRoomId,
				name: snapshot.val().name,
				roomCode: snapshot.val().roomCode
			})
			setIsLoading(false);
		})

		return () => {
			roomRef.off('value');
		}

	}, [roomID, user?.id, history]);

	return {
		room,
		questions,
		isLoading
	}
}
