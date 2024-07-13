import { Stack } from '@mui/material';
import { useTemplateSelector } from '../../store';
import { Label } from '../Label';

export const SheetLabels = () => {
	const currentSheetIndex = useTemplateSelector((s) => s.sheet.currentIndex);
	const rows = useTemplateSelector((s) => s.sheet.labelSpecs.rows);
	const columns = useTemplateSelector((s) => s.sheet.labelSpecs.columns);

	return (
		<Stack direction="column" sx={{ minHeight: '100%', overflow: 'visible' }} justifyContent="space-between">
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<Stack
					direction="row"
					key={rowIndex}
					justifyContent="space-between"
					minWidth={'100%'}
					sx={{ overflow: 'visible',  }}>
					{Array.from({ length: columns }).map((_, columnIndex) => {
						const labelIndex = currentSheetIndex * rows * columns + rowIndex * columns + columnIndex;
						return <Label key={labelIndex} labelIndex={labelIndex} />;
					})}
				</Stack>
			))}
		</Stack>
	);
};

export default SheetLabels;
