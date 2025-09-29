// PopupCreateUser.jsx
import { useState } from 'react';
import '../styles/popup.css'; // Asegúrate de tener estilos adecuados

const PopupCreateUser = ({ show, setShow, action }) => {
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    email: '',
    rut: '',
    password: '',
    rol: 'usuario',
    telefono: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await action(userData);
    if (success) {
      // Limpiar el formulario y cerrar el popup
      setUserData({
        nombreCompleto: '',
        email: '',
        rut: '',
        password: '',
        rol: 'usuario',
        telefono: ''
      });
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={userData.nombreCompleto}
              onChange={handleInputChange}
              required
              minLength={15}
              maxLength={50}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
              pattern=".*@gmail\.cl$"
              title="El correo debe terminar en @gmail.cl"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rut">RUT</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={userData.rut}
              onChange={handleInputChange}
              required
              pattern="^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$|^[0-9]{7,8}-[0-9kK]{1}$"
              title="Formato válido: 12.345.678-9 o 12345678-9"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              maxLength={26}
              pattern="^[a-zA-Z0-9]+$"
              title="La contraseña solo puede contener letras y números"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="rol"
              value={userData.rol}
              onChange={handleInputChange}
            >
              <option value="usuario">Usuario</option>
              <option value="cliente">Cliente</option>
              <option value="trabajador_tienda">Trabajador de Tienda</option>
              <option value="gerente">Gerente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={userData.telefono}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="popup-actions">
            <button type="button" onClick={() => setShow(false)} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="confirm-button">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupCreateUser;