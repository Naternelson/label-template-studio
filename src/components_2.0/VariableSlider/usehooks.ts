import { useCallback, useEffect, useRef, useState } from 'react';

export type VariableSliderProps = {
	id?: string;
	onChange: (variable: number) => void;
	value: number;
	label: string;
	asPercentage?: boolean;
	append?: string;
	prepend?: string;
	toFixed?: number;
	commaSeparated?: boolean;
	step?: number;
	min?: number;
	max?: number;
	tooltip?: string;
};
export const useVariabelSlider = (params: VariableSliderProps) => {
	const {
		onChange,
		value,
		label,
		asPercentage = false,
		append = '',
		prepend = '',
		toFixed,
		commaSeparated = false,
		step = 1,
		min = -Infinity,
		max = Infinity,
	} = params;

	/**
	 * Extract the correct number from the formatted string
	 */
	const unRenderedValue = useCallback(
		(value: string) => {
			if (asPercentage) {
				return parseFloat(value.replace('%', '')) / 100;
			}
			return parseFloat(value);
		},
		[asPercentage],
	);
	/**
	 * Format the number to be displayed
	 */
	const renderValue = useCallback(
		(value: number) => {
			let renderValue = value.toString();

			if (toFixed !== undefined) renderValue = value.toFixed(toFixed);
			if (commaSeparated) renderValue = Number(value).toLocaleString();
			if (append) renderValue += append;
			if (prepend) renderValue = prepend + renderValue;
			if (asPercentage) renderValue = (value * 100).toFixed(toFixed) + '%';

			return renderValue;
		},
		[asPercentage, append, commaSeparated, prepend, toFixed],
	);
	const [mouseDown, setMouseDown] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [renderText, setRenderText] = useState<string>(renderValue(value));
	const [holdValue, setHoldValue] = useState(value);

	const clampValue = (value: number) => {
		const v = Math.max(min, Math.min(max, value));
		if (isNaN(v)) return 0;
		return v;
	};

	const applyStep = (value: number) => {
		const steppedValue = Math.round(value / step) * step;
		return clampValue(steppedValue);
	};

	/**
	 * Handle the mouse down event for the label element
	 * When the user scrolls left or right while dragging on the element, the value will be stepped +/- according to the change in the x-axis
	 */
	const handleMouseDown = (e: React.MouseEvent) => {
		const startX = e.clientX;
		const initialValue = value;
		setMouseDown(true);
		let holdValue: number = initialValue;
		const handleMouseMove = (moveEvent: MouseEvent) => {
			document.body.style.cursor = 'w-resize';
			const currentX = moveEvent.clientX;
			const deltaX = currentX - startX;
			const newValue = applyStep(initialValue + deltaX * step); // Use step directly
			setRenderText(renderValue(newValue));
			setHoldValue(newValue);
			holdValue = newValue
		};

		/**
		 * When the user finishs dragging the mouse, remove the event listeners and reset the cursor
		 */
		const handleMouseUp = () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = '';
			setMouseDown(false);
			onChange(holdValue);
			inputRef.current!.blur();
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			inputRef.current!.blur();
		}
	};

	/**
	 * Update the renderText and intermediateValue when the value changes externally
	 */
	useEffect(() => {
		const renderTextMatch = renderValue(value) === renderText;
		if (!renderTextMatch) {
			setRenderText(renderValue(value));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	/**
	 * When the user changes the input, update the intermediate value, and the render text, but do not change via the 'onChange' event yet
	 */
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const inputValue = event.target.value;
		setRenderText(inputValue);
		const unRendered = unRenderedValue(inputValue);
		setHoldValue(unRendered);
	};
	/**
	 * When the input is clicked, select the text
	 */
	const inputClick = (e: React.MouseEvent) => {
		inputRef.current?.select();
	};

	/**
	 * When the input is blurred, clamp the value, apply the step, and update the value via the 'onChange' event
	 */
	const onInputBlur = () => {
		const v = holdValue;
		const clampedValue = clampValue(v);
		// const steppedValue = applyStep(clampedValue);
		onChange(clampedValue);
		setRenderText(renderValue(clampedValue));
	};
	return {
		input: {
			onClick: inputClick,
			onChange: onInputChange,
			onBlur: onInputBlur,
			onKeyDown: handleKeyPress,
			inputRef: inputRef,
			value: renderText,
			inputProps: { style: { cursor: mouseDown ? 'w-resize' : 'text', minWidth: '1px', width: undefined } },
		},
		label: {
			onMouseDown: handleMouseDown,
			children: label,
		},
		mouseDown,
	};
};
