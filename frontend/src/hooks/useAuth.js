import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ email, password }) => {
            const res = await authAPI.login(email, password);
            return res.data;
        },
        onSuccess: (res) => {
            localStorage.setItem('token', res.data.token);
            navigate('/stocks', { replace: true });
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ email, password }) => authAPI.register( email, password),
        onSuccess: () => {
            navigate('/login');
        },
    });
};