// frontend/src/pages/TrabajadorOperations.jsx
import { useState, useEffect } from 'react';
import Table from '@components/Table';
import Search from '@components/Search';
import '@styles/operations.css';

const TrabajadorOperations = () => {
    const [operations, setOperations] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedOperation, setSelectedOperation] = useState(null);

    useEffect(() => {
        loadOperations();
    }, []);

    const loadOperations = async () => {
        // Llamar al servicio del backend
        // GET /trabajador-tienda/operations
        // Por ahora datos de ejemplo
        setOperations([
            {
                id_operacion: 1,
                cliente: 'María González',
                descripcion: 'Mesa de comedor 6 personas',
                estado: 'pendiente',
                costo: 180000,
                fecha_entrega: '2024-12-15'
            },
            {
                id_operacion: 2,
                cliente: 'Carlos Mendoza',
                descripcion: 'Set de 4 sillas',
                estado: 'en_proceso',
                costo: 340000,
                fecha_entrega: '2024-12-20'
            }
        ]);
    };

    const columns = [
        { title: "ID", field: "id_operacion", width: 80 },
        { title: "Cliente", field: "cliente", width: 200 },
        { title: "Descripción", field: "descripcion", width: 300 },
        { title: "Estado", field: "estado", width: 150 },
        { title: "Costo", field: "costo", width: 120, formatter: "money" },
        { title: "Entrega", field: "fecha_entrega", width: 120 }
    ];

    return (
        <div className="operations-container">
            <div className="top-section">
                <h1>Operaciones</h1>
                <Search 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    placeholder="Buscar operación..."
                />
            </div>
            
            <Table 
                data={operations}
                columns={columns}
                filter={filter}
                dataToFilter="descripcion"
                initialSortName="id_operacion"
                onSelectionChange={(selected) => setSelectedOperation(selected[0])}
            />
        </div>
    );
};

export default TrabajadorOperations;