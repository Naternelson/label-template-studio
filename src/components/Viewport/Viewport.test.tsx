import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Viewport } from './Viewport';
describe('Viewport componenent', () => {
	it('should render children corrently', () => {
		render(
			<Viewport>
				<div> Test Content</div>
			</Viewport>,
		);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});
});
