import { Box, styled } from '@mui/material';
import { useScale } from '../../store/sheet/hooks';
import { useEffect, useState } from 'react';

export const ScaleIndicator = () => {
	const { scale } = useScale();
	const [show, setShow] = useState(true);
	const scaleIndicator = (scale * 100).toString() + '%';

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, [scale]);

	return (
		<StyledIndicator sx={{ opacity: show ? 1 : 0, transition: 'opacity .2s ease-out' }}>
			{scaleIndicator}
		</StyledIndicator>
	);
};

const StyledIndicator = styled(Box)({
	position: 'absolute',
	right: '0',
	top: '0',
    padding: "0.25rem"
});
