'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchReservations = async () => {
      try {
        const response = await fetch(`/api/reservations?email=${userData.email}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
          if (data.length > 0) {
            setEditData(data[0]);
            fetchStatus(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [router]);

  const fetchStatus = async (id) => {
    try {
      const response = await fetch(`/api/reservation-status?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ ...prev, [id]: data }));
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleSelectReservation = (index) => {
    setSelectedIndex(index);
    setEditData(reservations[index]);
    setEditMode(false);
    fetchStatus(reservations[index].id);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editData.id,
          ...editData,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const newReservations = [...reservations];
        newReservations[selectedIndex] = updated;
        setReservations(newReservations);
        setEditData(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user || reservations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No tienes reservas</h1>
          <a href="/" className="text-blue-600 hover:underline font-medium">
            Realizar una reserva
          </a>
        </div>
      </div>
    );
  }

  const currentReservation = reservations[selectedIndex];
  const currentStatus = status[currentReservation?.id] || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Historial */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Historial</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reservations.map((res, idx) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectReservation(idx)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedIndex === idx
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{res.paquete}</p>
                    <p className="text-sm text-gray-600">{new Date(res.createdAt).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detalles y Estado */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Estado */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Estado</h3>
                  <span className="text-sm font-medium text-blue-600">
                    {currentStatus.status || 'Procesando'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${currentStatus.percentComplete || 0}%` }}
                  />
                </div>
              </div>

              {editMode ? (
                // Formulario de edición
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={editData.nombre || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      value={editData.observaciones || ''}
                      onChange={handleEditChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      Guardar cambios
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista de detalles
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium text-gray-900">{currentReservation.nombre}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Paquete</p>
                      <p className="font-medium text-gray-900">{currentReservation.paquete}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium text-gray-900">{currentReservation.direccion}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Observaciones</p>
                      <p className="font-medium text-gray-900">{currentReservation.observaciones || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Fecha de creación</p>
                      <p className="font-medium text-gray-900">
                        {new Date(currentReservation.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleEditClick}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                  >
                    Editar reserva
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
