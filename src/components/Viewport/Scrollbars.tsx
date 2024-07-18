import { Box, lighten } from '@mui/material';
import { Boundary, dBounds, getElementPosition } from './util';
import { backgroundColor, BorderColor, PanelColor } from '../../constants';
import { useCallback, useEffect, useState } from 'react';

export const Scrollbars = (props: { contentId: string; containerId: string; boundary?: Boundary }) => {
	const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });
	const [contentDims, setContentDims] = useState({ width: 0, height: 0, scale: 1, top: 0, left: 0 });

	const getElements = useCallback(() => {
		const container = document.getElementById(props.containerId);
		const content = document.getElementById(props.contentId);

		if (!container || !content) {
			console.warn('Parent or content element not found');
			return;
		}
		return { container, content };
	}, [props.containerId, props.contentId]);

	useEffect(() => {
		const elements = getElements();
		if (!elements) return;
		// Observer for container dimensions
		const containerObserver = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			setContainerDims({ width, height });
		});

		containerObserver.observe(elements.container);
		return () => {
			containerObserver.disconnect();
		};
	}, [getElements]);

	useEffect(() => {
		const elements = getElements();
		if (!elements) return;
		// Observe for mutations in content dimensions
		const config = {
			attributes: true,
			attributeFilter: ['style'],
			subtree: false,
		};
		const contentObserver = new MutationObserver((mutations) => {
			const position = getElementPosition(elements.content);
			setContentDims({
				width: elements.content.clientWidth,
				height: elements.content.clientHeight,
				scale: position.scale,
				top: position.top,
				left: position.left,
			});
			console.log('Content dims', position);
		});
		contentObserver.observe(elements.content, config);
		return () => {
			contentObserver.disconnect();
		};
	}, [getElements]);

	return (
		<>
			{/* <HorizontalScrollbars /> */}
			<VerticalScrollbars contentDims={contentDims} containerDims={containerDims} boundary={props.boundary} />
		</>
	);
};

type ScrollBarProps = {
	contentDims: { width: number; height: number; scale: number; top: number; left: number };
	containerDims: { width: number; height: number };
	boundary?: Boundary;
};
const VerticalScrollbars = (props: ScrollBarProps) => {
	const { contentDims, containerDims, boundary } = props;
	const [scrollHeight, setScrollHeight] = useState(20);
	const [scrollTop, setScrollTop] = useState(0);
	const db = dBounds(boundary);

	const shouldRender =
		contentDims.height * contentDims.scale > containerDims.height ||
		contentDims.top < (db.top ?? 0) ||
		contentDims.top + contentDims.height * contentDims.scale > containerDims.height - (db.bottom ?? 0);

	useEffect(() => {
		const db = dBounds(boundary);
		let containerY = containerDims.height - (db.top?? 0) - (db.bottom ?? 0);
		let contentY = contentDims.height + contentDims.top 
		let scrollHeight = (containerY / contentY) * containerY;
		setScrollHeight(scrollHeight);
		console.log({ containerY, contentY, scrollHeight });


	}, [contentDims, containerDims, boundary, scrollHeight]);

	return (
		<Box
			sx={{
				boxSizing: 'border-box',
				position: 'absolute',
				right: 0,
				top: 0,
				bottom: 0,
				width: '12px',
				visibility: shouldRender ? 'visible' : 'visible',
			}}>
			<Box
				sx={{
					cursor: 'pointer',

					borderRadius: '5px',
					position: 'absolute',
					left: 0,
					right: 0,
					minHeight: '20px',
					height: scrollHeight,
					top: scrollTop,
					backgroundColor: lighten(PanelColor, 0.1),
				}}></Box>
		</Box>
	);
};
