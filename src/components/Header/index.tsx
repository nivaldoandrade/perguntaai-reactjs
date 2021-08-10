import { useState, useEffect, useRef } from 'react';
import { ButtonCode } from '../ButtonCode';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { Dropdown } from '../Dropdown';
import { ModalRoom } from '../Modal/ModalRoom';

import { useAuth } from '../../hooks/useAuth';

import { firebase } from '../../services/firebase';

import LogoImg from '../../assets/images/logo.svg';

import styles from './Styles.module.scss';

interface HeaderProps {
	roomID?: string;
	roomCode?: number;
	isAdminRoom?: boolean;
}

export function Header({ roomID, roomCode, isAdminRoom = false }: HeaderProps) {
	const { user } = useAuth();
	const isMobile = useMediaQuery({ query: '(max-width: 426px)' });

	const [modalOpen, setModalOpen] = useState(false);
	const [isShowMenu, setIsShowMenu] = useState(false);

	const divRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (e: Event) => {
		if (divRef.current && !divRef.current.contains(e.target as Node)) {
			setIsShowMenu(false);
		}
	};

	useEffect(() => {
		if (isShowMenu) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		}
	}, [isShowMenu])

	async function handleClosedRoom() {
		if (!roomID && !isAdminRoom) {
			return;
		}

		await firebase.database().ref('rooms').child(String(roomID)).remove()
	}

	function toggleModal() {
		setIsShowMenu(false);
		setModalOpen(state => !state);
	}

	function handleShowMenu() {
		setIsShowMenu(state => !state);
	}

	return (
		<div id={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Link to="/">
					<img src={LogoImg} alt="letmeask" />
				</Link>
				<div className={styles.navBar}>
					{!isMobile && <ButtonCode roomCode={roomCode} />}
					{
						user && (
							<button
								className={styles.buttonAvatar}
								type="button"
								onClick={handleShowMenu}
							>
								<img src={user?.avatar} alt={user?.name} />
							</button>
						)
					}
				</div>
				{isShowMenu && (
					<Dropdown
						toggleModal={toggleModal}
						isAdminRoom={isAdminRoom}
						roomCode={roomCode}
						ref={divRef}
					/>
				)}
			</div>
			<ModalRoom
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				closedRoom={handleClosedRoom}
			/>
		</div >
	);
}