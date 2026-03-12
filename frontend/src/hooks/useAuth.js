import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ email, password }) => authAPI.login(email, password),
        onSuccess: (res) => {
            localStorage.setItem('token', res.data.token);
            navigate('/stocks', { replace: true });
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ name, email, password }) => authAPI.register(name, email, password),
        onSuccess: () => {
            navigate('/login');
        },
    });
};