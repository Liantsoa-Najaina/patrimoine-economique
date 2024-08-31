import React from 'react'
import Patrimoine from "./../../../models/Patrimoine.js";
import Personne from "./../../../models/Personne.js";
import Flux from "./../../../models/possessions/Flux.js";
import Possession from "./../../../models/possessions/Possession.js";
import BienMateriel from "./../../../models/possessions/BienMateriel.js"

const john = new Personne("John Doe");

const dateToday = new Date();

const macBookPro = new Possession(john, "MacBook Pro", 4000000, new Date("2023-12-25"), null, 5);
const salaire = new Flux(john,"Alternance",500_000, new Date("2022-12-31"),null,null,1);
const traindevie = new Flux(john,"Survie",-300_000, new Date("2022-12-31"),null,null,2)
const bienMateriel = new BienMateriel(john, "Effet vestimentaire", 1_000_000, new Date("2022-12-31"), null, 20);


const possessions = [macBookPro,salaire,traindevie,bienMateriel];

// Valeur Actuelle
const valeurMac = macBookPro.getValeur(dateToday);
const valeurSalaire = salaire.getValeur(dateToday);
const valeurtrainDeVie = traindevie.getValeur(dateToday);
const valeurBienMat = bienMateriel.getValeur(dateToday);

export const valeurActuelle = [valeurMac, valeurSalaire, valeurtrainDeVie, valeurBienMat];

const johnPatrimoine  = new Patrimoine(john,possessions);

export default function Result({ value }) {
    
    return (
        <div>
            <h4>Patrimoinde de {john.nom} le {value || "..."} est : {isNaN(johnPatrimoine.getValeur(new Date(value)).toFixed(0)) ? 0 : johnPatrimoine.getValeur(new Date(value)).toFixed(0)} </h4>
        </div>
    )
}