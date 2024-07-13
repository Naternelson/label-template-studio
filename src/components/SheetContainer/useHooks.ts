import { useTemplateSelector } from "../../store";

const useRenderHeight = () => {
	const height = useTemplateSelector((s) => s.sheet.dimensions.height);
	const unit = useTemplateSelector((s) => s.global.unit);
	const scale = useTemplateSelector((s) => s.sheet.scale);

	// Convert to Unit from inches, then multiply by scale and append unit. Unit could be 'cm', 'in', or 'mm'

	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};
	return convertToUnit(height) * scale + unit;
};
const useRenderWidth = () => {
	const width = useTemplateSelector((s) => s.sheet.dimensions.width);
	const unit = useTemplateSelector((s) => s.global.unit);
	const scale = useTemplateSelector((s) => s.sheet.scale);

	// Convert to Unit from inches, then multiply by scale and append unit. Unit could be 'cm', 'in', or 'mm'

	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};
	return convertToUnit(width) * scale + unit;
};

export const useContainerHooks = () => {
    return {height: useRenderHeight(), width: useRenderWidth()}

};
