import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Title } from 'chart.js';
import Possession from '../../../models/possessions/Possession';
import Flux from '../../../models/possessions/Flux';
import InstancePatrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js'
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title);

const LineChart = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [valueDebut, setValueDebut] = useState("");
  const [dateDebut, setDateDebut] = useState("");

  const [valueFin, setValueFin] = useState("");
  const [dateFin, setDateFin] = useState("");
  
  const [valueJour, setValueJour] = useState("");
  const [jour, setJour] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setValueDebut("");
    setDateDebut(valueDebut);
    setValueFin("");
    setDateFin(valueFin);
    setValueJour("");
    setJour(valueJour);
    navigate("range");
  }

  useEffect(() => {
    async function getData() {
      try {
        let reponse = await fetch('http://localhost:5000/patrimoine', { method: 'GET' });

        if (reponse.ok) {
          const data = await reponse.json();
          setData(data.data);
          // console.log("Les donnes : ", data);
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

  const obtenirMoisEntreDates = (dateDebut, dateFin, jour) => {
    let mois = [];
    let valeurPatrimoine = [];
    let dateActuelle = new Date(dateDebut);

    while (
      dateActuelle.getFullYear() < new Date(dateFin).getFullYear() || 
      (dateActuelle.getFullYear() === new Date(dateFin).getFullYear() && 
        (dateActuelle.getMonth() < new Date(dateFin).getMonth() ||
         (dateActuelle.getMonth() === new Date(dateFin).getMonth() && dateActuelle.getDate() <= new Date(dateFin).getDate())))
    ) {
      let dateToday = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), jour);
      mois.push(dateToday.toLocaleString('fr-FR', { day:'numeric',month: 'numeric', year: 'numeric' }));
      valeurPatrimoine.push(patrimoine.getValeur(dateToday));

      // Passe au mois suivant
      dateActuelle.setMonth(dateActuelle.getMonth() + 1);
    }

    return {mois, valeurPatrimoine};
  }

  const value = obtenirMoisEntreDates(dateDebut, dateFin, jour); 

  const donne = {
    labels: value.mois,
    datasets: [
      {
        label: 'Patrimoine',
        data: value.valeurPatrimoine,
        fill: false,
        borderColor: 'green',
        tension: 0.1,
      }
    ]
  }

  return (
    <div className='p-8'>
      <form className='flex items-end py-4' onSubmit={handleSubmit}>
        <div className='mx-4'>
          <p>Date debut : </p>
          <input type="date" className='border border-gray-600 py-2 px-4 rounded-lg' value={valueDebut} onChange={(ev) => setValueDebut(ev.target.value)} required />
        </div>
        <div className='mx-4'>
          <p>Date fin : </p>
          <input type="date" className='border border-gray-600 py-2 px-4 rounded-lg' value={valueFin} onChange={(ev) => setValueFin(ev.target.value)} required />
        </div>
        <div className='mx-4'>
          <p>Jour : </p>
          <input type="number" className='border border-gray-600 py-2 pl-4 rounded-lg' value={valueJour} onChange={(ev) => setValueJour(ev.target.value)} required />
        </div>
        <button className='bg-blue-600 mx-2 py-2 px-3 rounded-xl text-white' type='submit'>Valider</button>
      </form>
      <div className='border my-6 h-96 w-full flex justify-center items-center Line'>
        <Line data={donne} className='w-full' />
      </div>
    </div>
  );
};

export default LineChart;
