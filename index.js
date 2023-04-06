export const applyCustomCode = externalCodeSetup => {
	externalCodeSetup.navigationApi.setAnimatedSwitchNavigator(
		(routes, options, routeProps) => {
			const feature = routeProps.settings.features.multisite_network;
			const hasMultiSite = Platform.select({
				ios: feature.is_enabled_ios,
				android: feature.is_enabled_android
			});

			const getInitialSwitchRoute = () => {
				if (!routeProps.hasValidSigning) {
					return "InvalidSigningScreen";
				}

				if (routeProps.shouldEnforceVersionControl) {
					return "VersionControlScreen";
				} else if (routeProps.isLoggedIn) {
					if (
						routeProps.isFeatureEnabled(hasMultiSite) &&
						routeProps.sites.selectedSite === null
					) {
						return "AuthSiteSelectionScreen";
					} else {
						return routeProps.shouldLockApp ? "AppLockScreen" : "noAuth";
					}
				} else {
					return "noAuth"; //Use noAuth to skip login screen
				}
			};

			const newOptions = {
				...options,
				initialRouteName: getInitialSwitchRoute()
			};

			return {
				routes,
				options: newOptions
			};
		}
	);
};
