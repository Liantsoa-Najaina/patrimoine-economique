import './App.css'
import Title from "./components/Navbar.jsx";
import TableauPossessions from "./components/TableauPossessions.jsx";

function App() {
    return (
        <>
            <Title/>
            <main className="main-container">
                <section className={"possessions"}>
                    <TableauPossessions/>
                </section>
            </main>
        </>
    )
}
export default App
