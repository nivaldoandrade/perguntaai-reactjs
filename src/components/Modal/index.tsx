import { ReactNode, useEffect, useState } from 'react';
import ReactModal from 'react-modal';

import DangerImg from '../../assets/images/danger.svg';

import styles from './Styles.module.scss';

interface ModalProps {
	roomID?: string;
	children: ReactNode;
	isOpen: boolean;
	setIsOpen: () => void;
}

export function Modal({ children, isOpen, setIsOpen, roomID }: ModalProps) {
	const [showModal, setShowModal] = useState(isOpen);

	useEffect(() => {
		if (showModal !== isOpen) {
			setShowModal(isOpen);
		}
	}, [isOpen, showModal])

	return (
		<ReactModal
			isOpen={showModal}
			onRequestClose={setIsOpen}
			className={styles.modalContainer}
			overlayClassName={styles.modalOverlay}
			ariaHideApp={false}
		>
			<div className={styles.modalContent}>
				<img src={DangerImg} alt='Icone de Perigo' />
				{children}
			</div>
		</ReactModal>
	);
}