import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Button from '../Components/Button';

export default function Menu() {
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

    return (
        <>
            <h1 className='text-center text-3xl py-9'>Bienvenu : {data.possesseur.nom} </h1>
            <div className='flex justify-center items-center'>
                <Button print={"Patrimoine"} target={"patrimoine"} />
                <Button print={"Possessions"} target={"possession"} />
            </div>
        </>
    )
}