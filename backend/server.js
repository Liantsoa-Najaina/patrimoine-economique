import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { readFile, writeFile } from '../data/index.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/possession', async (req, res) => {
  try {
    const fileData = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileData);
    const filePath = path.join(dirname, '../data/data.json');
    const data = await readFile(filePath, 'utf8');

    if (data.status === 'OK') {
      res.json(data.data);
    } else {
      res.json({ message: error });
    }
  } catch (error) {
    res.status(500).send('Erreur lors de la lecture des données : ' + error);
  }
});

app.post('/possession/create', async (req, res) => {
  try {
    const fileData = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileData);
    const filePath = path.join(dirname, '../data/data.json');

    const data = await readFile(filePath, 'utf8');

    const request = req.body;
    const possesseur = data.data.possesseur;

    const newPossession = {
      possesseur: possesseur,
      libelle: request.libelle,
      valeur: parseInt(request.valeur),
      dateDebut: new Date(request.dateDebut),
      dateFin: null,
      tauxAmortissement: parseInt(request.tauxAmortissement)
    };

    data.data.possessions.push(newPossession)

    const newPatrimoine = {
      possesseur: possesseur,
      possessions: data.data.possessions
    }
    writeFile(filePath, newPatrimoine);

    res.status(201).send('Nouvelle possession ajoutée avec succès.');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/possession/:libelle/update', async (req, res) => {
  try {
    const fileData = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileData);
    const filePath = path.join(dirname, '../data/data.json');

    const donnes = req.body;
    const { libelle } = req.params;

    let newLibelle = "";

    const libellePrev = libelle.split('').slice(1, libelle.length);
    for (let index = 0; index < libellePrev.length; index++) {
      const element = libellePrev[index];
      newLibelle += element;
    }

    const result = await readFile(filePath);

    if (result.status === 'OK') {
      const data = result.data;
      const possession = data.possessions.find(p => p.libelle === newLibelle);

      possession.libelle = donnes.libelle;
      possession.dateFin = new Date(donnes.dateFin);

      await writeFile(filePath, data);

      res.status(200).json({ message: "Update successfully" });
    } else {
      res.status(500).json({ message: "Erreur" });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors de l\'analyse du fichier JSON.' });
  }
});

app.put('/possession/:libelle/close', async (req, res) => {
  try {
    const fileData = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileData);
    const filePath = path.join(dirname, '../data/data.json');

    const { libelle } = req.params;

    let newLibelle = "";

    const libellePrev = libelle.split('').slice(1, libelle.length);
    for (let index = 0; index < libellePrev.length; index++) {
      const element = libellePrev[index];
      newLibelle += element;
    }
    const result = await readFile(filePath);
    if (result.status === 'OK') {
      const data = result.data;
      const possession = data.possessions.find(p => p.libelle === newLibelle );

      possession.dateFin = new Date();

      await writeFile(filePath, data);

      res.status(200).json({ message: "Possession Closing" });
    } else {
      res.status(500).json({ message: "Erreur" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/patrimoine', async (req, res) => {
  try {
    const fileData = fileURLToPath(import.meta.url);
    const dirname = path.dirname(fileData);
    const filePath = path.join(dirname, '../data/data.json');

    const result = await readFile(filePath);
    if (result.status === 'OK') {
      const data = result.data;
      res.status(200).json({data: data});
    } else {
      res.status(500).json({message: 'Erreur sur la lecture de donne'});
    }
  } catch (err) {
    res.status(500).json({message: err})
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});