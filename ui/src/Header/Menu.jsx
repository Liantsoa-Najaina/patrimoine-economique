// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Components/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import patrimoineImage from '../assets/coins-3344603_1280.png';
import listeImage from '../assets/list-2160914_1280.png';


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
        <Container className="my-4">
            <h1 className='text-center text-3xl py-9'>Bienvenue : {data.possesseur.nom} </h1>
            <div className='d-flex justify-content-center gap-4'>
                {/* Card for Patrimoine Button */}
                <Card style={{ width: '18rem' }} className="text-center">
                    <Card.Img variant="top" src={patrimoineImage}  alt="Patrimoine" />
                    <Card.Body>
                        <Button print={"Patrimoine"} target={"patrimoine"} />
                    </Card.Body>
                </Card>

                {/* Card for Possessions Button */}
                <Card style={{ width: '18rem' }} className="text-center">
                    <Card.Img variant="top" src={listeImage} alt="Possessions" /> {/* Replace with your image URL */}
                    <Card.Body>
                        <Button print={"Possessions"} target={"possession"} />
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}
