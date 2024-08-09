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