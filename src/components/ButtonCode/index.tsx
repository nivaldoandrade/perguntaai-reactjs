import { useEffect, useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

import styles from './Styles.module.scss';

interface ButtonCodeProps {
	roomCode?: number;
}

export function ButtonCode({ roomCode }: ButtonCodeProps) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (copied) setCopied(false)
		}, 2000)

		return () => {
			clearTimeout(timeout);
		}
	}, [copied])

	function handleclippboardRoomCode() {
		setCopied(true);
		navigator.clipboard.writeText(String(roomCode));
		toast.success('Código copiado com sucesso!')
	}

	return (
		<button
			className={styles.buttonCode}
			onClick={handleclippboardRoomCode}
		>
			<div>
				{!copied
					? (<FiCopy size={17} />)
					: (<FiCheck size={17} />)
				}
			</div>
			<p>Sala #{roomCode}</p>
		</button>
	);
}