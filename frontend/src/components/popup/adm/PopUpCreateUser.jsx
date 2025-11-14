import Form from '../../Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import { useState } from 'react';
import { convertirMinusculas } from '@helpers/formatData.js';
//import { EMAILS_DOMINIOS_PERMITIDOS } from '@helpers/validacion/emailValidation.js';

export default function PopupCreateUser({ show, setShow, action, isLoading }) {
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setError(null);
        
        try {
            // Validar y formatear los datos
            if (!formData.nombreCompleto || !formData.email || !formData.rut || !formData.password) {
                setError('Todos los campos son obligatorios');
                return;
            }
            
            // Convertir campos a minúsculas (excepto password)
            const { password, ...restData } = formData;
            const dataLowercase = convertirMinusculas(restData);
            
            // Añadir el rol "usuario" por defecto
            const formattedData = {
                ...dataLowercase,
                password,
                rol: 'usuario' // Agregar rol 'usuario' por defecto
            };
            
            console.log('Datos formateados a enviar:', formattedData);
            
            // Llamar a la acción con los datos formateados
            const success = await action(formattedData);
            
            if (success) {
                setShow(false);
            } else {
                setError('No se pudo crear el usuario. Revisa los datos e intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
        }
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);
    
    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    
                    {error && (
                        <div className="error-message visible" style={{margin: '10px', textAlign: 'center'}}>
                            {error}
                        </div>
                    )}
                    
                    <Form
                        title="Crear nuevo usuario"
                        fields={[
                            {
                                label: "Nombre completo",
                                name: "nombreCompleto",
                                placeholder: 'Daniel Perez Gonzalez',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 50,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Correo electrónico",
                                name: "email",
                                placeholder: 'example@gmail.cl',
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 3,
                                maxLength: 35,
                                pattern: /.*@gmail\.cl$/,
                                patternMessage: "El correo debe terminar en @gmail.*",
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                placeholder: '21.308.770-3',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                            },
                            {
                                label: "Contraseña",
                                name: "password",
                                placeholder: "**********",
                                fieldType: 'input',
                                type: "password",
                                required: true,
                                minLength: 8,
                                maxLength: 26,
                                pattern: /^[a-zA-Z0-9]+$/,
                                patternMessage: "Debe contener solo letras y números",
                            },
                            // El campo 'rol' ha sido eliminado
                            {
                                label: (
                                    <span>
                                        Teléfono
                                        <span className='tooltip-icon'>
                                            <img src={QuestionIcon} alt="Ayuda" />
                                            <span className='tooltip-text'>Este campo es opcional</span>
                                        </span>
                                    </span>
                                ),
                                name: "telefono",
                                placeholder: "+56912345678",
                                fieldType: 'input',
                                type: "tel",
                                required: false,
                            }
                        ]}
                        onSubmit={handleSubmit}
                        buttonText={isLoading ? "Creando..." : "Crear usuario"}
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}