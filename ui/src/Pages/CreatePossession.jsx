import React, { useState } from 'react';
import Button from '../Components/Button';

export default function CreatePossession() {
    const [formData, setFormData] = useState({
        libelle: '',
        valeur: '',
        dateDebut: '',
        tauxAmortissement: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5000/possession/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Possession ajouté");
                alert('Possession ajoutée avec succès !');
            } else {
                throw new Error('Erreur lors de l\'ajout de la possession');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-3xl mb-6">Créer une possession</h1>
            <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="libelle" className="block text-lg font-medium text-gray-700">Libelle:</label>
                    <input
                        type="text"
                        id="libelle"
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        name="libelle"
                        value={formData.libelle}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="valeur" className="block text-lg font-medium text-gray-700">Valeur:</label>
                    <input
                        type="number"
                        id="valeur"
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        name="valeur"
                        value={formData.valeur}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dateDebut" className="block text-lg font-medium text-gray-700">Date Début:</label>
                    <input
                        type="date"
                        id="dateDebut"
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        name="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="tauxAmortissement" className="block text-lg font-medium text-gray-700">Taux d'Amortissement:</label>
                    <input
                        type="number"
                        id="tauxAmortissement"
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        name="tauxAmortissement"
                        value={formData.tauxAmortissement}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 py-3 px-4 rounded-xl text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Créer
                </button>
            </form>
            <div className="text-center mt-4">
                <Button print={"Retour"} target={"/possession"} />
            </div>
        </div>
    );
}
