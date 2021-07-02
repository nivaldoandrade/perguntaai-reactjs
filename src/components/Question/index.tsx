import { ReactNode } from 'react';

import styles from './Styles.module.scss';

interface QuestionListProps {
	question: {
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
	};
	children: ReactNode;
}

export function Question({ question, children }: QuestionListProps) {
	return (
		<div
			className={`${styles.questionContent} ${question.isHighlighted ? styles.isHighlighted : ''} 
			${question.isAnswered ? styles.isAnswered : ''}`}

		>
			<p>{question.content}</p>
			<div className={styles.questionFooter}>
				<div className={styles.questionUser}>
					<img src={question.author.avatar} alt={question.author.name} />
					<p>{question.author.name}</p>
				</div>
				<div className={styles.questionButtons}>
					{children}
				</div>
			</div>
		</div>
	);
}