import { Grid, Stack, alpha, styled, useTheme } from '@mui/material';
import { useLabelSpecBorder, useLabelSpecPadding, useLabelSpecSpacing, useSheetBackground, useSheetIndex } from '../../store/sheet/hooks';
import { Label } from '../Label';
import { useEffect } from 'react';

export const SheetLabels = () => {
	return <SheetLabelFlex />;
};
const SheetLabelFlex = () => {
	const spacing = useLabelSpecSpacing();
	const padding = useLabelSpecPadding();
	const border = useLabelSpecBorder();
	const color = useSheetBackground().color;

	useEffect(() => {
		console.log({spacing})
	},[
		spacing
	])

	return (
		<ColumnStack
		id="hello"
			direction={'column'}
			justifyContent={'space-between'}
			minHeight="100%"
			minWidth="100%"
			aria-invalid={spacing.safeDim.exceeds}>
			{Array(spacing.rows)
				.fill(0)
				.map((_, i) => (
					<SheetRow color={color} row={i} spacing={spacing} padding={padding} border={border} key={i} />
				))}
		</ColumnStack>
	);
};

const ColumnStack = styled(Stack)(({theme}) => ({
	'&[aria-invalid="true"]': {
		outline: '2px solid ' + theme.palette.error.main,
	},
}));

type SheetRowProps = {
	row: number;
	spacing: ReturnType<typeof useLabelSpecSpacing>;
	padding: ReturnType<typeof useLabelSpecPadding>;
	border: ReturnType<typeof useLabelSpecBorder>;
	color: string;
};

const SheetRow = (props: SheetRowProps) => {
    const getIndex = (j:number) => (props.spacing.columns * props.row) + (j)
	return (
		<Stack direction={'row'} justifyContent={'space-between'} flex={1}>
			{Array(props.spacing.columns)
				.fill(0)
				.map((_, i) => (
					<Label
					color={props.color}
						unit={props.spacing.unit}
						width={props.spacing.scaled.labelWidth}
						height={props.spacing.scaled.labelHeight}
						key={i}
						padding={props.padding}
						index={getIndex(i)}
						border={props.border}
					/>
				))}
		</Stack>
	);
};
