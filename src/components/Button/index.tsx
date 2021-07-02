import { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react';
import { IconBaseProps } from 'react-icons';

import styles from './Styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ComponentType<IconBaseProps>;
	backgroundColor?: string;
	color?: string;
	children: ReactNode;
	isOutline?: boolean;
}

export function Button({ icon: Icon, isOutline = false, backgroundColor, color, children, ...rest }: ButtonProps) {
	return (
		<button
			className={`${styles.button} ${isOutline ? styles.outline : ''}`}
			{...rest}
			style={{
				backgroundColor: backgroundColor,
				color: color
			}}
		>
			{Icon && <Icon size={20} />}
			{children}
		</button>
	);
}