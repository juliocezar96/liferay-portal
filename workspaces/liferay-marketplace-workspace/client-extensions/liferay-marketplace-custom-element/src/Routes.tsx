/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {getSiteURL} from './components/InviteMemberModal/services';
import {Liferay} from './liferay/liferay';
import {AppCreationFlow} from './pages/AppCreationFlow/AppCreationFlow';
import {CustomerGatePage} from './pages/CustomerGatePage/CustomerGatePage';
import GetAppPage from './pages/GetAppPage/GetAppPage';
import {NextStepPage} from './pages/NextStepPage/NextStepPage';
import {PublishedAppsDashboardPage} from './pages/PublishedAppsDashboardPage/PublishedAppsDashboardPage';
import {PurchasedAppsDashboardPage} from './pages/PurchasedAppsDashboardPage/PurchasedAppsDashboardPage';
import PurchasedSolutions from './pages/PurchasedSolutions/PurchasedSolutions';

export default function AppRoutes() {
	const pathUrl = (page: string) => {
		return `${getSiteURL()}/${page}` as string;
	};

	if (Liferay.ThemeDisplay.isSignedIn()) {
		return (
			<Router>
				<Routes>
					<Route
						element={<AppCreationFlow />}
						path={pathUrl('create-app')}
					/>

					<Route element={<GetAppPage />} path={pathUrl('get-app')} />

					<Route element={<NextStepPage />} path="next-steps" />

					<Route
						element={<PurchasedAppsDashboardPage />}
						path={pathUrl('customer-dashboard')}
					/>

					<Route
						element={<PublishedAppsDashboardPage />}
						path={pathUrl('publisher-dashboard')}
					/>

					<Route
						element={<CustomerGatePage />}
						path={pathUrl('customer-gate')}
					/>

					<Route
						element={<PurchasedSolutions />}
						path={pathUrl('purchased-solutions')}
					/>
				</Routes>
			</Router>
		);
	}

	return <></>;
}
