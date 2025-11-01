import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			fetchCurrentUser();
		} else {
			setLoading(false);
		}
	}, []);

	const fetchCurrentUser = async () => {
		try {
			const response = await api.get('/user');
			setUser(response.data);
		} catch (error) {
			console.error('Failed to fetch user', error);
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		const response = await api.post('/login', credentials);
		localStorage.setItem('token', response.data.token);
		setUser(response.data.user);
		return response.data.user;
	};

	const register = async (userData) => {
		const response = await api.post('/register', userData);
		localStorage.setItem('token', response.data.token);
		setUser(response.data.user);
		return response.data.user;
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		api.post('/logout');
	};

	return (
		<AuthContext.Provider value={{
			user,
			loading,
			login,
			register,
			logout,
			isAuthenticated: !!user
		}}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);