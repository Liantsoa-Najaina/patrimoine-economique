import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom'

import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';

export default function ListPossession() {
    const { libelle } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function closePossession() {
            try {
                let response = await fetch(`http://localhost:5000/possession/${libelle}/close`, {
                    method: 'PUT',
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Reponse serveur : ", data);
                    navigate('/possession');
                } else {
                    const data = await response.json()
                    console.log("Erreur : ", data);
                }
            } catch (error) {
                console.error("Erreur sur le transfert de donne :", error);
            }
        }

        if (libelle) {
            closePossession();
        }
    }, [libelle, navigate]);

    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const response = await axios.get('http://localhost:5000/possession');
                setData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        }
        getData();
    }, []);

    if (!data) {
        return <div>Aucune donnée trouvée</div>;
    }

    const LesPossessions = data.possessions.filter(element => element.valeur !== 0);
    const newPossession = LesPossessions.map(element => new Possession(element.possesseur, element.libelle, element.valeur, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement));
    const LesFlux = data.possessions.filter(element => element.valeur == 0);
    const newFlux = LesFlux.map(element => new Flux(element.possesseur, element.libelle, element.valeurConstante, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement, element.jour));
    const possessions = newPossession.concat(newFlux);

    return (
        <>
            <div>
                <h1 className='text-center text-3xl py-9'>Liste des possessions de : {data.possesseur.nom} </h1>
            </div>
            <div className="mx-8 my-4 shadow-md rounded-xl overflow-hidden border-2">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700 border">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">
                                Libellé
                            </th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">
                                Valeur
                            </th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">
                                Date début
                            </th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">
                                Date fin
                            </th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">Taux d'amortissement</th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left">Valeur Actuelle</th>
                            <th scope="col" className="py-3 px-6 text-lg text-gray-700 font-medium text-left"></th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                        {possessions.map((possession, index) => (
                            <tr key={index} className="hover:bg-blue-100">
                                <td className="py-4 px-6 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white" >{possession.libelle}</td>
                                <td className="py-4 px-6 text-lg font-semibold text-gray-900 whitespace-nowrap dark:text-white">{Math.abs(possession.valeur) || Math.abs(possession.valeurConstante)}</td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{new Date(possession.dateDebut).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {
                                        possession.dateFin === "..." ? "..." : new Date(possession.dateFin).toLocaleDateString()
                                    }
                                </td>
                                <td className="py-4 px-8 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {possession.tauxAmortissement !== null ? `${possession.tauxAmortissement}%` : 0 + '%'}
                                </td>
                                <td className="py-4 px-8 text-lg font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                                    {possession.getValeur(new Date()).toFixed(0)}
                                </td>
                                <td scope="col" className="py-3 px-6 text-lg text-gray-700 text-left flex items-center">
                                    <Link to={`:${possession.libelle}/update`} className='mx-4 text-xl'>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    <Link to={`:${possession.libelle}/close`} className='text-xl' onClick={() => closePossession()} >
                                        <i className="fa-regular fa-circle-xmark"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}