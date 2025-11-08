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

type recoverFormData = {
  email: string;
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

const ResetPassword = () => {
  const { user, isAuthenticated, error, setError, isLoading, recoverPass } =
    useAuth();
  //   const { err, setErr } = useGlobalVariable();
  const [email, setEmail] = useState<string>("");
 

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? colors.dark : colors.light;

  useEffect(() => {
    setError("");
  }, []);

  const handleSubmission = async (): Promise<void> => {
    const data: recoverFormData = {
      email: email.trim(),
 
    };
    recoverPass(data);
  };

  return (
    <View className={"flex-1 bg-white px-10"}>
      
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
              Veiller entre votre adresse mail pour obtenir un nouvau mot de passe {" "}
            </ThemedText>
 
          </View>

   
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

export default ResetPassword;





//recover 
     // recover password
//        public function recover(Request $request, $lang = "en")
//     {
        
//         try {
//         App::SetLocale($lang);
        
//         $request->validate([
//             'email' => 'required|email',
//         ]);
        
//         $email =  $request->email;
//         $password = Str::password(8,true,false,false,false);
        
//         $user = User::where('email', $email)->first();
        
//         $name =  $user->name;
            
//         User::where('id', $user->id)->update([
//                     'password' => Hash::make($password)
//             ]);
                
//             // Mail::to($request->user())->send(new RecoverPassword( $name, $email, $password));
//             Mail::to($request->email)->send(new RecoverPassword( $name, $email, $password));

//             return response()->json([
//                     'status' => 200,
//                     'message' => 'user password is sucessfully updated',
//             ]);
//         } catch(\Exception $e) {
//             return response()->json([
//                     'status' => 500,
//                     'message' => $e->getMessage(),
//             ]);
//         }
        
            
//     }