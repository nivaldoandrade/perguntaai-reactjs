import { useState } from 'react';
import { ButtonCode } from '../ButtonCode';
import { Button } from '../Button';
import { Link } from 'react-router-dom';

import { ModalRoom } from '../Modal/ModalRoom';

import { firebase } from '../../services/firebase';

import LogoImg from '../../assets/images/logo.svg';

import styles from './Styles.module.scss';

interface HeaderProps {
	roomID?: string;
	roomCode?: number;
	isAdminRoom?: boolean;
}

export function Header({ roomID, roomCode, isAdminRoom = false }: HeaderProps) {

	const [modalOpen, setModalOpen] = useState(false);

	async function handleClosedRoom() {
		if (!roomID && !isAdminRoom) {
			return;
		}

		await firebase.database().ref('rooms').child(String(roomID)).remove()
	}

	function toggleModal() {
		setModalOpen(state => !state);
	}

	return (
		<div id={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Link to="/">
					<img src={LogoImg} alt="letmeask" />
				</Link>
				<div>
					<ButtonCode roomCode={roomCode} />
					{isAdminRoom && (
						<Button isOutline onClick={toggleModal}>
							Encerrar sala
						</Button>
					)}
				</div>
			</div>
			<ModalRoom
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				closedRoom={handleClosedRoom}
			/>
		</div >
	);
}