// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import Button from '../Components/Button'
import { useParams } from 'react-router-dom'
// import axios from 'axios';

export default function UpdatePossession() {
  const { libelle } = useParams();

  let vide = "";

  const libellePrev = libelle.split('').slice(1, libelle.length);
  for (let index = 0; index < libellePrev.length; index++) {
    const element = libellePrev[index];
    vide += element;
  }

  const [newData, setNewData] = useState({
    "libelle": "",
    "dateFin": "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`http://localhost:5000/possession/${libelle}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Réponse du serveur:', data);
        alert("Possession update successfully")
      } else {
        throw new Error(`Erreur HTTP! statut: ${response}`);
      }
    } catch (error) {
      console.error('Il y a eu une erreur lors de la mise à jour:', error);
      alert("Erreur, Veuiller ressayer");
    }
  };

  return (
    <div>
      <h1 className="text-3xl py-2">Update possession : </h1>
      <form className='px-32' onSubmit={handleSubmit}>
        <div className='py-4 px-2'>
          <h1>Libelle : </h1>
          <input type="text" className='border border-1 border-black rounded pl-4 py-2' placeholder={vide} name="libelle" value={newData.libelle} onChange={handleChange} required />
        </div>
        <div className='py-4 px-2'>
          <h1>Date Fin : </h1>
          <input type="date" className='border border-1 border-black rounded px-9 py-2' name="dateFin" value={newData.dateFin} onChange={handleChange} required />
        </div>
        <button type="submit" className="bg-blue-600 py-4 px-7 rounded-xl text-white">Update</button>
      </form>
      <Button print={"Retour"} target={"/possession"} />
    </div>
  )
}