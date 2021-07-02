import { Modal } from '../index';
import { Button } from '../../Button';

interface ModalQuestionProps {
	isOpen: boolean;
	setIsOpen: () => void;
	removeQuestion: () => void;
}

export function ModalQuestion({ removeQuestion, isOpen, setIsOpen }: ModalQuestionProps) {

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
			<h1>Excluir pergunta</h1>
			<p>Tem Certeza que você deseja excluir essa pergunta?</p>
			<div>
				<Button
					onClick={setIsOpen}
					backgroundColor="#DBDCDD"
					color="#737380"
				>
					Cancelar
				</Button>
				<Button
					onClick={removeQuestion}
					backgroundColor="#E73F5D"
				>
					Sim, excluir
				</Button>
			</div>
		</Modal>
	);
}