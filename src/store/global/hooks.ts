import { useCallback } from 'react';
import { useTemplateSelector } from '..';

export const useUnit = () => {
	const unit = useTemplateSelector((state) => state.global.unit);
	const convertForStorage = useCallback(
		(value: number) => {
			switch (unit) {
				case 'in':
					return value;
				case 'cm':
					return value / 2.54;
				case 'mm':
					return value / 25.4;
			}
		},
		[unit],
	);

	const convertForClient = useCallback(
		(value: number) => {
			switch (unit) {
				case 'in':
					return value;
				case 'cm':
					return value * 2.54;
				case 'mm':
					return value * 25.4;
			}
		},
		[unit],
	);

	return {
		unit,
		convertForStorage,
		convertForClient,
	};
};
