// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export default function ListPossession() {
    const { libelle } = useParams();
    const navigate = useNavigate();

    const closePossession = async () => {
        try {
            let response = await fetch(`http://localhost:5000/possession/${libelle}/close`, {
                method: 'PUT',
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Réponse serveur : ", data);
                navigate('/possession');
            } else {
                const data = await response.json();
                console.log("Erreur : ", data);
            }
        } catch (error) {
            console.error("Erreur sur le transfert de données :", error);
        }
    };

    useEffect(() => {
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
    const LesFlux = data.possessions.filter(element => element.valeur === 0);
    const newFlux = LesFlux.map(element => new Flux(element.possesseur, element.libelle, element.valeurConstante, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement, element.jour));
    const possessions = newPossession.concat(newFlux);

    return (
        <>
            <div className="text-center py-4">
                <h1 className="mb-4"><Badge variant="info">{data.possesseur.nom}</Badge></h1>
            </div>
            <div className="container my-4">
                <Table responsive bordered hover className="table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Libellé</th>
                        <th>Valeur</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Amortissement</th>
                        <th>Valeur Actuelle</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {possessions.map((possession, index) => (
                        <tr key={index}>
                            <td>{possession.libelle}</td>
                            <td>{Math.abs(possession.valeur) || Math.abs(possession.valeurConstante)}</td>
                            <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                            <td>{possession.dateFin === "..." ? "..." : new Date(possession.dateFin).toLocaleDateString()}</td>
                            <td>{possession.tauxAmortissement !== null ? `${possession.tauxAmortissement}%` : '0%'}</td>
                            <td>{possession.getValeur(new Date()).toFixed(0)}</td>
                            <td className="text-center">
                                <Link to={`:${possession.libelle}/update`} className='btn btn-outline-primary btn-sm mx-1'>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <Button variant="outline-danger" size="sm" className="mx-1" onClick={() => closePossession()}>
                                    <i className="fa-regular fa-circle-xmark"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}
