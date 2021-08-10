import { forwardRef, ForwardRefRenderFunction } from "react";
import { FiLogOut, FiX } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';

import { useAuth } from "../../hooks/useAuth";
import { ButtonCode } from "../ButtonCode";

import styles from './Styles.module.scss';

interface DropdownProps {
	toggleModal: () => void;
	isAdminRoom: boolean;
	roomCode?: number
}

const DropdownComponent: ForwardRefRenderFunction<HTMLDivElement, DropdownProps> =
	({ toggleModal, isAdminRoom, roomCode }, ref) => {
		const { user, signOutWithGoogle } = useAuth();

		const isMobile = useMediaQuery({ query: '(max-width: 426px)' });

		return (
			<div ref={ref} className={styles.dropdownContainer}>

				<div className={styles.userContent}>
					<img src={user?.avatar} alt={user?.name} />
					<strong>{user?.name}</strong>
				</div>

				<div className={styles.buttonsContent}>
					{isMobile && <ButtonCode roomCode={roomCode} />}

					{isAdminRoom && (
						<button onClick={toggleModal}>
							<FiX size={16} />
							<p>Encerrar sala</p>
						</button>
					)}

					<button onClick={signOutWithGoogle}>
						<FiLogOut size={16} />
						<p>Sair</p>
					</button>
				</div>
			</div>
		)
	}

export const Dropdown = forwardRef(DropdownComponent);