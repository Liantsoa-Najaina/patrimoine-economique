import './App.css'
import Title from "./components/Navbar.jsx";
import TableauPossessions from "./components/TableauPossessions.jsx";
// import CalculerPatrimoine from "./components/CalculerPatrimoine.jsx";

function App() {
    return (
        <>
            <Title/>
            <main className="main-container">
                <section className={"possessions"}>
                    <TableauPossessions/>
                </section>
{/*
                <section className={"valeur-patrimoine"}>
                    <h2>Valeur de votre patrimoine économique</h2>
                    <CalculerPatrimoine></CalculerPatrimoine>
                </section>*/}
            </main>
        </>
    )
}

export default App
