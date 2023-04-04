import { Text, TextInput, View } from "react-native";

import React from "react";

export function applyCustomCode(externalCodeSetup) {
	// call custom code api here
	externalCodeSetup.navigationApi.replaceScreenComponent("LoginScreen", () => (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text> hello hamza</Text>
			<TextInput placeholder={"login"} />
			<TextInput placeholder={"password"} />
		</View>
	)						
	);
	}
