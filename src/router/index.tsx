import { createBrowserRouter } from 'react-router-dom';
import { WithLoadingScreen } from '../components';
import { DevLayout, RootPage, ViewportComp } from '../pages';

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<WithLoadingScreen>
				<RootPage />
			</WithLoadingScreen>
		),
	},
	{
		path: '/dev',
		element: (
			<WithLoadingScreen>
				<DevLayout />
			</WithLoadingScreen>
		),
		children: [
			{
				path: 'viewport',
				element: <ViewportComp />,
			},
		],
	},
]);
