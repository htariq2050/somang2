import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TouchableOpacity, Alert, TextInput } from "react-native";
import LoginScreen from "@src/containers/Custom/LoginScreen";
import AppButton from "@src/components/AppButton";
import { getExternalCodeSetup } from '@src/externalCode/externalRepo';

const externalCodeSetup = getExternalCodeSetup();

const MyModal = ({ modalVisible, setModalVisible, otp, setOtp, validateOtp }) => {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please enter the OTP we sent to your mobile number</Text>
            <TextInput
              style={styles.input}
              onChangeText={setOtp}
              value={otp}
              placeholder="Enter OTP..."
              keyboardType="numeric"
            />

            <Button
              onPress={() => validateOtp()}
              title="Submit"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const MyCustomScreen = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(null);
  const [loginAction, setLoginAction] = useState(null);

  //Do OTP validation here such as calling an API to validate the otp input...
  const validateOtp = () => {

    if (otp == "1234"){
      console.log('logging in...');
      loginAction()
    }else {
      console.log('Invalid OTP');
    }

    setModalVisible(false)
  }

  externalCodeSetup.authApi.setLoginButton(props => {

    const {
      t,
      global,
      stateUsername,
      statePassword,
      isSignUpEnabled,
      privacyPolicy,
      termsOfService,
      withUserAgreementCheckbox,
      stateAgreementChecked,
      passwordInputRef,
      usernameInputRef,
      doLogin,
      auth,
      colors
    } = props;

    //Assign hook's doLogin function to a local state variable to make it available throughout the component...
    useEffect(() => {
      setLoginAction(() => () => doLogin());
    },[doLogin])

    //Render login button which shows a modal when pressed...
    return <AppButton
      style={[{ marginTop: 10 }, global.authButtonContainer]}
      onPress={() => {
        if (!!!stateUsername || !!!statePassword) {
          return false;
        }
        if (
          !isSignUpEnabled &&
          withUserAgreementCheckbox &&
          (privacyPolicy || termsOfService) &&
          !stateAgreementChecked
        ) {
          return Alert.alert(
            t("login:user_agreement_title"),
            t(
              `login:user_agreement_message${privacyPolicy ? "_privacy" : ""
              }${termsOfService ? "_terms" : ""}`
            )
          );
        }
        passwordInputRef.blur();
        usernameInputRef.blur();
        setModalVisible(true);
      }}
      label={t("login:login")}
      global={global}
      loading={auth.isFetching}
      labelStyle={global.authButtonLabel}
      spinnerColor={colors.authButtonTextColor}
    />
  });

  return <>
    <LoginScreen {...props} />
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      otp={otp}
      setOtp={setOtp}
      validateOtp={validateOtp}
    />
  </>
}

MyCustomScreen.navigationOptions = {
  header: null
}

export default MyCustomScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  centeredView: {
    top: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

//In custom_code/index.js...

...

import MyCustomScreen from "./components/MyCustomScreen";

export const applyCustomCode = externalCodeSetup => {
 externalCodeSetup.navigationApi.replaceScreenComponent("LoginScreen", MyCustomScreen);
}