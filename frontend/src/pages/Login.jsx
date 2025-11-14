import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { login } from '@services/auth.service.js';
import Form from '@components/Form';
import useLogin from '@hooks/auth/useLogin.jsx';
import '@styles/form.css';
import { EMAILS_DOMINIOS_PERMITIDOS } from '@helpers/validacion/emailsDomains.js';
import cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    // Verificar si ya está autenticado
    useEffect(() => {
        const checkAuth = () => {
            const storedUser = sessionStorage.getItem('usuario');
            const token = cookies.get('jwt-auth');
            
            if (storedUser && token) {
                // Si ya está autenticado, redirigir al home
                navigate('/home', { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    const loginSubmit = async (data) => {
        try {
            const response = await login(data);
            
            if (response.status === 'Success') {
                
                navigate('/home', { replace: true });
            } else if (response.status === 'Client error') {
                errorData(response.details);
            } else {
                console.error('Respuesta inesperada:', response);
                // Mostrar error en el campo email por defecto
                errorData({ 
                    dataInfo: 'email', 
                    message: response.message || 'Error de autenticación'
                });
            }
        } catch (error) {
            console.error('Error en loginSubmit:', error);
            errorData({ 
                dataInfo: 'email', 
                message: 'Error de conexión. Inténtelo nuevamente.'
            });
        }
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
            <Form
                title="Iniciar sesión"
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: 'input',
                        type: "email",
                        autoComplete: "email",
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                        errorMessageData: errorEmail,
                        validate: {
                            dominioValido: (value) => {
                                if (!value.includes("@")) return "Email inválido";
                                const dominio = value.split("@")[1];
                                return EMAILS_DOMINIOS_PERMITIDOS.includes(dominio) ||
                                    "El correo debe pertenecer a un dominio permitido";
                            }
                        },
                        onChange: (e) => handleInputChange('email', e.target.value),
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: 'input',
                        type: "password",
                        autoComplete: "current-password",
                        required: true,
                        minLength: 4,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                        errorMessageData: errorPassword,
                        onChange: (e) => handleInputChange('password', e.target.value)
                    },
                ]}
                buttonText="Iniciar sesión"
                onSubmit={loginSubmit}
                
            />
        </main>
    );
};

export default Login;