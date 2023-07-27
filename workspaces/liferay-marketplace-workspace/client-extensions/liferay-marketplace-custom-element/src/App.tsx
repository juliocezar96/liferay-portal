/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayIconSpriteContext} from '@clayui/icon';

import AppRoutes from './Routes';
import {getIconSpriteMap} from './liferay/constants';

import './App.scss';

function App() {
	return (
		<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
			<AppRoutes />
		</ClayIconSpriteContext.Provider>
	);
}

export default App;
