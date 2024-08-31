// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Button from '../Components/Button';
import { useParams } from 'react-router-dom';

export default function UpdatePossession() {
  const { libelle } = useParams();

  // Generate libellePrev by removing the first character
  const libellePrev = libelle.slice(1);

  const [newData, setNewData] = useState({
    libelle: "",
    dateFin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`http://localhost:5000/possession/${libelle}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Réponse du serveur:', data);
        alert("Possession updated successfully");
      } else {
        throw new Error(`Erreur HTTP! statut: ${response}`);
      }
    } catch (error) {
      console.error('Il y a eu une erreur lors de la mise à jour:', error);
      alert("Erreur, veuillez réessayer");
    }
  };

  return (
      <div className="container my-4">
        <h1 className="text-center text-3xl mb-6">Update Possession</h1>
        <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="libelle" className="block text-lg font-medium text-gray-700">Libelle:</label>
            <input
                type="text"
                id="libelle"
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder={libellePrev}
                name="libelle"
                value={newData.libelle}
                onChange={handleChange}
                required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="dateFin" className="block text-lg font-medium text-gray-700">Date Fin:</label>
            <input
                type="date"
                id="dateFin"
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                name="dateFin"
                value={newData.dateFin}
                onChange={handleChange}
                required
            />
          </div>
          <button
              type="submit"
              className="w-full bg-blue-600 py-3 px-4 rounded-xl text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update
          </button>
        </form>
        <div className="text-center mt-4">
          <Button print={"Retour"} target={"/possession"} />
        </div>
      </div>
  );
}
