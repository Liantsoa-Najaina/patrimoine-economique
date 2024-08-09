import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Title() {
    return (
        <Navbar className="bg-body-tertiary" fixed="top">
            <Container>
                <Navbar.Brand href="#home">Patrimoine Economique</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <a href="#login">Liantsoa Najaina</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


/*{
    "possesseur": { "nom": "John Doe" },
    "libelle": "Alternance",
    "valeur": 0,
    "dateDebut": "2022-12-31T21:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": null,
    "jour": 1,
    "valeurConstante": 500000
},
{
    "possesseur": { "nom": "John Doe" },
    "libelle": "Survie",
    "valeur": 0,
    "dateDebut": "2022-12-31T21:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": null,
    "jour": 2,
    "valeurConstante": -300000
    ,
        {
          "possesseur": { "nom": "John Doe" },
          "libelle": "MacBook Pro",
          "valeur": 4000000,
          "dateDebut": "2023-12-25T00:00:00.000Z",
          "dateFin": null,
          "tauxAmortissement": 5
        }
}*/