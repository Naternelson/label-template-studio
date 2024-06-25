import { RootTemplateState, useTemplateSelector } from '../store';

// All Measurements are to be stored as inches in the store and converted to the client's unit of measurement
export const useClient = (measurement: number) => {
	const unit = useTemplateSelector((s) => s.global.unit);
	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};
	return convertToUnit(measurement) + unit;
};

export const useClientSelector = (cb: (s: RootTemplateState) => number, asPt?: boolean) => {
	const unit = useTemplateSelector((s) => s.global.unit);
	const measurement = useTemplateSelector(cb);
	if (asPt) return measurement + 'pt';
	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};
	return convertToUnit(measurement) + unit;
};

export const useStorage = () => {
	const unit = useTemplateSelector((s) => s.global.unit);
	const convertToInches = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement / 2.54 : measurement / 25.4;
	};
	return convertToInches;
};
