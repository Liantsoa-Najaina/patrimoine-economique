// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import LineChart from '../Pages/LineChart'
import Possession from '../../../models/possessions/Possession';
import Flux from '../../../models/possessions/Flux';
import InstancePatrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button.jsx';

export default function Patrimoine() {
  const [data, setData] = useState(null);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  function handleDate(event) {
    event.preventDefault();
    setValue("");
    setDate(value);
    navigate(`:${value}`);
  }

  useEffect(() => {
    async function getData() {
      try {
        let reponse = await fetch('http://localhost:5000/patrimoine', { method: 'GET' });

        if (reponse.ok) {
          const data = await reponse.json();
          setData(data.data);
        } else {
          console.log("Erreur : ", reponse);
        }
      } catch (error) {
        console.log(error);
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

  const personne = new Personne(data.possesseur.nom);
  const patrimoine = new InstancePatrimoine(personne, possessions);

  return (
      <>
        <div className="d-flex justify-content-end mb-4" style={{marginTop: '20px', marginRight: '30px'}}>
          <Button print={"Menu"} target={"/"}/>
        </div>

        <div>
          <LineChart/>
        </div>
        <div className='flex'>
          <form onSubmit={handleDate} className="container px-8">
            <p className='text-xl py-4'>Selectionner une date : </p>
            <input type="date" onChange={(event) => setValue(event.target.value)} value={value} className='border border-gray-600 py-2 px-4 rounded-lg'/>
            <button className='bg-blue-600 mx-2 py-2 px-3 rounded-xl text-white' type='submit'>Valider</button>
            <p className='text-xl py-4'>La valeur du patrimoine à cette date est :
              <span className='font-semibold text-2xl mx-1'>
              {patrimoine.getValeur(new Date(date)).toFixed(0)}
            </span>
            </p>
          </form>
        </div>
      </>
  )
}