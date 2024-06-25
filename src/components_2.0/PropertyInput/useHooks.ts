import { useEffect, useRef, useState } from 'react';

export type PropertyInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	tooltip?: string;
	placeholder?: string;
	disabled?: boolean;
};

export const usePropertyInput = (params: PropertyInputProps) => {
	const { onChange, value, label, tooltip, placeholder, disabled } = params;
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleBlur = () => {
		if (inputValue !== value) onChange(inputValue);
	};

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const onClick = () => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	};
	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleBlur();
		}
	}
	return {
		onClick,
		input: {
			inputRef: inputRef,
			value: inputValue,
			onChange: handleChange,
			onBlur: handleBlur,
			placeholder,
			disabled,
			onKeyDown,
		},
		label,
		tooltip,
	};
};
