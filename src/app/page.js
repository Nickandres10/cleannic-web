'use client';

import { useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    paquete: '',
    observaciones: '',
  });

  const openModal = (packageName) => {
    setSelectedPackage(packageName);
    setFormData({ ...formData, paquete: packageName });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage('');
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      paquete: '',
      observaciones: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar datos por email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Abrir WhatsApp después de enviar el email
        const mensaje = `Hola, me gustaría solicitar el paquete "${formData.paquete}". Mis datos son: Nombre: ${formData.nombre}, Teléfono: ${formData.telefono}, Email: ${formData.email}, Dirección: ${formData.direccion}, Observaciones: ${formData.observaciones}`;
        const urlWhatsApp = `https://wa.me/593997569717?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
        alert('Solicitud enviada correctamente por email y WhatsApp');
      } else {
        alert('Error al enviar la solicitud: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar tu solicitud');
    }
    
    closeModal();
  };

  const packages = [
    {
      name: "Básico Hogar",
      price: "$25",
      description: (
        <>
          <ul className="list-disc ml-6 space-y-2">
            <li>Barrido y trapeado</li>
            <li>Orden general</li>
            <li>Cocina limpia + platos</li>
            <li>Aromatización</li>
          </ul>
        </>
      ),
    },
    {
      name: "Premium Hogar",
      price: "$40",
      description: (
        <>
          <ul className="list-disc ml-6 space-y-2">
            <li>Plan Básico Hogar</li>
            <li>Lavado de ropa (10kg)</li>
            <li>Limpieza de vidrios</li>
            <li>Desinfección</li>
            <li>Orden total del hogar</li>
            <li>Orden básico de habitaciones</li>
          </ul>
        </>
      ),
    },
    {
      name: "Oficina Express",
      price: "$35",
      description: (
        <>
          <ul className="list-disc ml-6 space-y-2">
            <li>Limpieza de escritorios</li>
            <li>Pisos y Baños</li>
            <li>Orden General</li>
            <li>Aromatización</li>
          </ul>
        </>
      ),
    },
    {
      name: "Post Construcción",
      price: "$60",
      description: (
        <>
          <ul className="list-disc ml-6 space-y-2">
            <li>Eliminación de polvo</li>
            <li>Residuos de Obra</li>
            <li>Barrido y Trapeado</li>
            <li>Aromatización</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
     
{/* NAVBAR */}
<nav className="bg-white shadow-md w-full z-50">

  <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-2">

    {/* LOGO */}
    <div className="flex items-center">

      <div className="bg-white">
  <img
  src="/logo.png"
  alt="Cleannic Logo"
  className="h-24 md:h-28 lg:h-32 w-auto object-contain"
/>

</div>


    </div>

    {/* MENÚ */}
    <div className="flex gap-10 text-gray-800 font-medium text-lg">

      <a
        href="#paquetes"
        className="hover:text-yellow-600 transition"
      >
        Servicios
      </a>

      <a
        href="#beneficios"
        className="hover:text-yellow-600 transition"
      >
        Beneficios
      </a>

      <a
        href="#contacto"
        className="hover:text-yellow-600 transition"
      >
        Contacto
      </a>

    </div>

  </div>

</nav>


      {/* HERO PREMIUM */}
<section className="w-full bg-black">

  <img
    src="/banner.jpg"
    alt="Cleannic Banner"
    className="w-full"
  />

</section>

      {/* PAQUETES */}
      <section
        id="paquetes"
        className="py-20"
        style={{ backgroundColor: "#C8D9E6" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">
            Nuestros Paquetes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {packages.map((item, index) => (
              <div
                key={index}
                className="
  bg-white
  rounded-3xl
  p-8
  flex
  flex-col
  justify-between
  min-h-[430px]
  border
  border-gray-200
  shadow-lg
  hover:shadow-2xl
  hover:-translate-y-3
  transition-all
  duration-300
  "
              >
                <div className="mb-6 h-20">
                  <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                    {item.name === 'Básico Hogar' ? (
                      <>
                        Básico
                        <br />
                        Hogar
                      </>
                    ) : item.name === 'Oficina Express' ? (
                      <>
                        Oficina
                        <br />
                        Express
                      </>
                    ) : (
                      item.name
                    )}
                  </h3>
                  <div className="w-16 h-1 bg-yellow-600 rounded-full mt-4"></div>
                </div>

                <div className="flex-grow mb-8">
                  <div className="text-gray-600 leading-relaxed">
                    {item.description}
                  </div>
                </div>

                <div className="text-5xl font-bold text-yellow-600 mb-8 whitespace-nowrap self-center">
                  {item.price}
                </div>

                <div className="mb-6 text-sm text-gray-500">
                  {item.name === 'Post Construcción' ? 'Tiempo estándar: 5 horas' : 'Tiempo estándar: 3 horas'}
                </div>

                <button 
                  onClick={() => openModal(item.name)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition font-semibold">
                  Solicitar Servicio
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        id="beneficios"
        className="py-20"
        style={{ backgroundColor: "#C8D9E6" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">
                Personal Capacitado
              </h3>

              <p>
                Contamos con profesionales entrenados y verificados.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">
                Atención Inmediata
              </h3>

              <p>
                Agenda tus servicios desde cualquier dispositivo.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">
                Productos Premium
              </h3>

              <p>
                Utilizamos productos seguros y de alta calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        className="py-20"
        style={{ backgroundColor: "#C8D9E6" }}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-5xl font-bold text-center mb-10">
            Solicita tu Servicio
          </h2>

          <form className="grid gap-6">
            <input
              type="text"
              placeholder="Nombre Completo"
              className="border p-4 rounded-2xl"
            />

            <input
              type="tel"
              placeholder="Teléfono"
              className="border p-4 rounded-2xl"
            />

            <input
              type="email"
              placeholder="Correo Electrónico"
              className="border p-4 rounded-2xl"
            />

            <input
              type="text"
              placeholder="Dirección"
              className="border p-4 rounded-2xl"
            />

            <select className="border p-4 rounded-2xl">
              <option>Seleccione un paquete</option>
              <option>Básico Hogar</option>
              <option>Premium Hogar</option>
              <option>Oficina Express</option>
              <option>Post Construcción</option>
            </select>

            <textarea
              rows={5}
              placeholder="Observaciones"
              className="border p-4 rounded-2xl"
            ></textarea>

            <button className="w-full bg-black text-white py-4 rounded-2xl font-semibold tracking-wide hover:bg-yellow-600 hover:text-black transition-all duration-300">
              Enviar Solicitud
            </button>
          </form>
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Solicitar Servicio</h2>
              <button 
                onClick={closeModal}
                className="text-2xl font-bold text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre Completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="border p-3 rounded-xl text-sm"
              />

              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="border p-3 rounded-xl text-sm"
              />

              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border p-3 rounded-xl text-sm"
              />

              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                className="border p-3 rounded-xl text-sm"
              />

              <select 
                name="paquete"
                value={formData.paquete}
                onChange={handleInputChange}
                required
                className="border p-3 rounded-xl text-sm"
              >
                <option>Seleccione un paquete</option>
                <option>Básico Hogar</option>
                <option>Premium Hogar</option>
                <option>Oficina Express</option>
                <option>Post Construcción</option>
              </select>

              <textarea
                name="observaciones"
                rows={3}
                placeholder="Observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="border p-3 rounded-xl text-sm"
              ></textarea>

              <button 
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WHATSAPP */}
      <a
        href="https://wa.me/593997569717"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl font-bold hover:bg-green-600 transition"
      >
        WhatsApp
      </a>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Cleannic
        </h3>

        <p className="text-gray-400">
          © 2026 Todos los derechos reservados
        </p>
      </footer>
    </main>
  );
}
