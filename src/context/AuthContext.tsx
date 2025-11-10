import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContextType = {
  user: any;
  loading: boolean;
  isLoading: boolean;
  error: string;
  setError: any;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  recoverPass:(resetPassData: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  userData: object;
  image: string;
};

interface User {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  // Add other user properties as needed
}

type credentials = {
  email: string;
  password: string;
  device_name: string;
};

type resetPass = {
  email: string;
};

type registerData = {
  firstname: string;
  lastname: string;
  phone: string;
  phoneCode: string;
  email: string;
  country: string;
  city: string;
  address: string;
  password: string;
  device_name: string;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null)
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("user_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        // Set axios default header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const login = async (credentials: credentials) => {
    setIsLoading(true);

    if (credentials.password === "" || credentials.email === "") {
      setError("Veillez remplir tout les champs");
      setIsLoading(false);
      return;
    } else if (credentials.password.length < 8) {
      setError("Le mot de passe doit avoir 8 charactères minimum");
      setIsLoading(false);
      return;
    } else if (!validateEmail(credentials.email)) {
      setError("Veillez entrer une adresse email valide!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/login", credentials);
      // const { user: userData, user_token, status, error } = response.data;
      const { user_data:userData, user_token, status, error } = response.data;

      if (status === 401) {
        setIsLoading(false);
        return setError("Mot de passe ou adresse mail incorrect");
      }

      if (error || status === 500) {
        setIsLoading(false);
        return setError(error || "Une erreur s'est produite");
      }

      if (status === 200) {
        // return console.log(user_token)
         
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("user_token", user_token);
        setUserData({ ...userData, dob: userData?.user_info?.qP2 })
        setUser(userData);
        console.log(userData?.user?.user_image,"image image.....")
        setImage(userData?.user?.user_image)
        setError("");
        setIsLoading(false);
        return router.replace("/protected/(tabs)");
      }
    } catch (e: any) {
      console.log(e.request,e, "Une erreur s'est produite lors de l'authentification");
      setError("Une erreur s'est produite lors de l'authentification");
      setIsLoading(false);
    }
  };

  const register = async (registerData: registerData) => {
    setIsLoading(true);

    try {
      const response = await api.post("/register", registerData);
      const { user: userData, user_token, status } = response.data;
  
      if (error || status === 500) {
        setIsLoading(false);
        return setError(error || "Une erreur s'est produite");
      }
  
      if (status === 200) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("user_token", user_token);
        setUser(userData);
        setError("");
        setIsLoading(false);
        return router.replace("/protected/(tabs)");
      }
      
    } catch (e:any) {
      console.log(e, "Une erreur s'est produite lors de l'authentification");
      setError("Une erreur s'est produite lors de l'authentification");
      setIsLoading(false);
    }

    // return response.data.user;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user_token");
    await AsyncStorage.removeItem("user");
    setUser(null);
    return router.replace("/login");
    // api.post("/logout");
  };


  const recoverPass = async (resetPassData: resetPass) => {

    setIsLoading(true);

    try {
      const response = await api.post("/recover-password", resetPassData);
      console.log(response.data,"response . data")  
      const { status, error } = response.data;
  

      if (error || status === 500) {
        setIsLoading(false);
        return setError(error || "Une erreur s'est produite");
      }
  
      if (status === 200) {
        setError("");
        setIsLoading(false);
        return router.replace("/(auth)/login");
      }
      
    } catch (e:any) {
      setError("Une erreur s'est produite lors de la reinitialisation du mot de passe");
      setIsLoading(false);
    }

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        image,
        loading,
        isLoading,
        error,
        setError,
        login,
        register,
        logout,
        recoverPass,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
