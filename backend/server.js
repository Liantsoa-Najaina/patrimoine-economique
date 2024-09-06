import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { readFile, writeFile } from './data/index.js';
import fs from "node:fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Liste les possession :
app.get('/possession', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, 'data/data.json');

		const data = await fs.readFile(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		const patrimoine = jsonData.find(item => item.model === 'Patrimoine');

		if (patrimoine && patrimoine.data && patrimoine.data.possessions) {
			res.json(patrimoine.data.possessions);
		} else {
			res.status(404).json({ message: "Liste des possessions introuvable" });
		}
	} catch (error) {
		res.status(500).send('Erreur lors de la lecture des données : ' + error);
	}
});

// Création d'une nouvelle possession
app.post('/possession/create', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, 'data/data.json');

		const fileContent = await fs.readFile(filePath, 'utf8');
		const data = JSON.parse(fileContent);

		const request = req.body;

		const patrimoineIndex = data.findIndex(item => item.model === 'Patrimoine');
		if (patrimoineIndex === -1) {
			return res.status(404).send('Patrimoine not found.');
		}

		const possesseur = data[patrimoineIndex].data.possesseur;

		const newPossession = {
			possesseur: possesseur,
			libelle: request.libelle,
			valeur: parseInt(request.valeur),
			dateDebut: new Date(request.dateDebut),
			dateFin: null,
			tauxAmortissement: parseInt(request.tauxAmortissement)
		};

		data[patrimoineIndex].data.possessions.push(newPossession);

		await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

		res.status(201).send('Nouvelle possession ajoutée avec succès.');
	} catch (error) {
		res.status(500).send('Erreur lors de la création de la possession: ' + error);
	}
});

// Mise à jour ou modification des informations d'une possession
app.put('/possession/:libelle/update', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, '../data/data.json');

		const { libelle } = req.params;
		const { newLibelle, dateFin } = req.body;

		const fileContent = await readFile(filePath, 'utf8');
		const jsonData = JSON.parse(fileContent);

		const possession = jsonData[1].data.possessions.find(p => p.libelle === libelle);

		if (!possession) {
			return res.status(404).json({ message: "Possession non trouvée" });
		}

		possession.libelle = newLibelle || possession.libelle;
		possession.dateFin = dateFin ? new Date(dateFin) : possession.dateFin;

		await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

		res.status(200).json({ message: "Mise à jour de la possession effectuée" });
	} catch (err) {
		res.status(500).json({ message: 'Erreur lors de la mise à jour des données: ' + err.message });
	}
});

// Mets fin à une possession
app.put('/possession/:libelle/close', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, '../data/data.json');

		const fileContent = await readFile(filePath, 'utf8');
		const jsonData = JSON.parse(fileContent);

		const { libelle } = req.params;
		const possession = jsonData[1].data.possessions.find(p => p.libelle === libelle);

		if (!possession) {
			return res.status(404).json({ message: "Possession not found" });
		}

		possession.dateFin = new Date();

		await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

		res.status(200).json({ message: "Possession closed successfully" });
	} catch (err) {
		res.status(500).json({ message: 'Erreur lors de la fermeture de la possession: ' + err.message });
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

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});