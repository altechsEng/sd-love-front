import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Logo,
  WelcomeImg,
  TextInputPerson,
  TextInputLock,
  TextInputEye,
} from "../../components/vectors.js";
import { FAMILLY, COLORS, TEXT_SIZE } from "../../utils/constants.js";
import { ScrollView } from "react-native-gesture-handler";
import CustomTextInput from "../../components/textInput.jsx";

import { useGlobalVariable } from "../../context/global.jsx";
import { CustomRegularPoppingText } from "../../components/text.jsx";
import axios from "axios";
import { deviceName } from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { ThemedText } from "@/src/components/ThemedText";
import { colors } from "@/src/constants/Theme";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import Email from "@/src/components/icons/Email";
import Lock from "@/src/components/icons/Lock";

type LoginFormData = {
  email: string;
  password: string;
  device_name: string;
};

type ApiResponse = {
  error?: boolean;
  status?: number;
  message?: string;
  user_id?: string;
  device_id?: string;
  user_token?: string;
  user_data?: {
    user: any;
    user_info: any;
  };
  user_image?: string;
};

const Login = () => {
  const { user, isAuthenticated, error, setError, isLoading, login } =
    useAuth();
  //   const { err, setErr } = useGlobalVariable();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  useEffect(() => {
    setError("");
  }, []);

  const handleSubmission = async (): Promise<void> => {
    const data: LoginFormData = {
      email: email.trim(),
      password: password.trim(),
      device_name: deviceName ?? "",
    };

    login(data);
  };

  return (
    <View className={"flex-1 bg-white px-10"}>
      {/* <View style={{ flex: 2, height: 70 }}></View> */}

      <View
        className={"relative flex-1 justify-center"}
        style={{ alignItems: "center" }}
      >
        <Logo />
        <Text
          style={{
            fontSize: TEXT_SIZE.title * 1.6,
            color: COLORS.primary,
            fontWeight: "bold",
            fontFamily: FAMILLY.semibold,
            marginVertical: 10,
          }}
        >
          SDLOVE
        </Text>
        <Text
          style={{
            fontSize: TEXT_SIZE.title * 1.2,
            color: COLORS.gray,
            fontWeight: "bold",
            fontFamily: FAMILLY.semibold,
            marginVertical: 10,
            marginBottom: 30,
          }}
        >
          Se connecter
        </Text>

        {/* <View
          style={{
            position: "relative",
            borderRadius: 50,
            paddingVertical: 0,
            paddingHorizontal: 36,
            width: "80%",
            backgroundColor: "rgba(181, 181, 181, 0.12)",
          }}
        >
          <CustomTextInput
            RightIconStyles={null}
            secure={false}
            name="email"
            placeHolder="Email"
            LeftIcon={"person"}
            LeftIconStyles={{ position: "absolute", top: 15, left: 18 }}
            RightIcon={null}
            setState={setEmail}
            state={email}
          />
        </View>

        <View
          style={{
            position: "relative",
            marginVertical: 15,
            borderRadius: 50,
            paddingVertical: 0,
            paddingHorizontal: 36,
            width: "80%",
            backgroundColor: "rgba(181, 181, 181, 0.12)",
          }}
        >
          <CustomTextInput
            secure={true}
            name="password"
            placeHolder="Password"
            LeftIcon={"lock"}
            LeftIconStyles={{ position: "absolute", top: 15, left: 18 }}
            RightIcon={"eye"}
            RightIconStyles={{ position: "absolute", top: 12, right: 18 }}
            setState={setPassword}
            state={password}
          />
        </View> */}

        <View className='flex flex-col w-full gap-6'>
          <View className="flex flex-col w-full gap-4">
            {/* Email filed */}
            <ThemedInput
              placeholder="Adresse email"
              value={email}
              onChangeText={setEmail}
              borderRadius={25}
              leftIcon={<Email color={theme.textSecondary} />}
            />

            {/* password field */}
            <ThemedInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              borderRadius={25}
              secureTextEntry={true}
              leftIcon={<Lock color={theme.textSecondary} />}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <ThemedText variant="caption" color="textPrimary">
              Mot de passe oublié ?{" "}
            </ThemedText>
            <Link href={"/protected/accademy"} asChild>
              <TouchableOpacity style={{ marginTop: 1 }}>
                <ThemedText variant="caption" color="main">
                  Reinitialiser
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>

          {/* <TouchableOpacity
          className={"mb-5"}
          onPress={() => handleSubmission()}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 15,
            marginTop: 20,
            paddingHorizontal: 20,
            width: "75%",
            borderRadius: 100,
          }}
        >
          {isLoading === true ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: FAMILLY.regular,
              }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity> */}
          <ThemedButton
            label="Connexion"
			borderRadius={25}
            onPress={() => handleSubmission()}
            variant="filled"
            isLoading={isLoading}
          />
          {error !== "" ? (
            <View className="flex flex-row items-center justify-center w-full gap-2 px-4 py-2 rounded-md">
              <ThemedText variant="caption" color="danger">
                {error}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </View>

      <View className={""} style={{ justifyContent: "flex-end" }}>
        <View
          className={"pb-8"}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
		  <ThemedText variant="caption" color="textPrimary">
            Vous n'avez pas un compte ?{" "}
          </ThemedText>
          <Link href={"/register-step-1"} asChild>
            <TouchableOpacity style={{ marginTop: 1 }}>
              <ThemedText variant="caption" color="main">
                Inscription
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Login;
