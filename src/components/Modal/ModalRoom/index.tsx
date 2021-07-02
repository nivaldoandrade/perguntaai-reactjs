import { Modal } from '../index';
import { Button } from '../../Button';

interface ModalRoomProps {
	isOpen: boolean;
	setIsOpen: () => void;
	closedRoom: () => void;
}

export function ModalRoom({ closedRoom, isOpen, setIsOpen }: ModalRoomProps) {

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
			<h1>Encerrar sala</h1>
			<p>Tem Certeza que você deseja encerrar esta sala?</p>
			<div>
				<Button
					onClick={setIsOpen}
					backgroundColor="#DBDCDD"
					color="#737380"
				>
					Cancelar
				</Button>
				<Button
					onClick={closedRoom}
					backgroundColor="#E73F5D"
				>
					Sim, encerrar
				</Button>
			</div>
		</Modal>
	);
}