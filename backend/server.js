import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from "node:fs/promises";
import Patrimoine from "../models/Patrimoine.js";
import Possession from "../models/possessions/Possession.js";
import BienMateriel from "../models/possessions/BienMateriel.js";
import Flux from "../models/possessions/Flux.js";

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
		const filePath = path.join(dirname, 'data/data.json');

		const { libelle } = req.params;
		const { newLibelle, dateFin } = req.body;

		const fileContent = await fs.readFile(filePath, 'utf8');
		const data = JSON.parse(fileContent);

		const patrimoineIndex = data.findIndex(item => item.model === 'Patrimoine');
		if (patrimoineIndex === -1) {
			return res.status(404).json({ message: "Patrimoine not found." });
		}

		const possessions = data[patrimoineIndex].data.possessions;

		const possession = possessions.find(p => p.libelle === libelle);
		if (!possession) {
			return res.status(404).json({ message: "Possession non trouvée" });
		}

		possession.libelle = newLibelle || possession.libelle;
		possession.dateFin = dateFin ? new Date(dateFin) : possession.dateFin;

		await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

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
		const filePath = path.join(dirname, 'data/data.json');

		const fileContent = await fs.readFile(filePath, 'utf8');
		const data = JSON.parse(fileContent);

		const patrimoineIndex = data.findIndex(item => item.model === 'Patrimoine');
		if (patrimoineIndex === -1) {
			return res.status(404).json({ message: 'Patrimoine not found.' });
		}

		const possessions = data[patrimoineIndex].data.possessions;

		const possessionToClose = possessions.find(p => p.libelle === req.params.libelle);
		if (!possessionToClose) {
			return res.status(404).json({ message: 'Possession non trouvée' });
		}

		possessionToClose.dateFin = new Date();

		await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

		res.status(200).json({ message: 'Possession closed successfully.' });
	} catch (err) {
		res.status(500).json({ error: 'Erreur lors de la fermeture de la possession: ' + err.message });
	}
});

// Calcule la valeur du patrimoine à une certaine date
app.get('/patrimoine/:date', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, 'data/data.json');

		const fileContent = await fs.readFile(filePath, 'utf8');
		const jsonData = JSON.parse(fileContent);

		// Extract possessions data
		const patrimoineData = jsonData.find(item => item.model === 'Patrimoine');
		if (!patrimoineData) {
			return res.status(404).json({ message: 'Patrimoine not found' });
		}

		const { possesseur, possessions } = patrimoineData.data;

		// Instantiate possessions
		const possessionInstances = possessions.map(p => {
			switch (p.model) {
				case 'Flux':
					return new Flux(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement, p.jour, p.valeurConstante);
				case 'BienMateriel':
					return new BienMateriel(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement);
				default:
					return new Possession(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement);
			}
		});

		const patrimoine = new Patrimoine(possesseur, possessionInstances);

		const dateParam = req.params.date;
		const date = new Date(dateParam);

		if (isNaN(date.getTime())) {
			return res.status(400).json({ message: 'Invalid date format, use YYYY-MM-DD.' });
		}

		let totalValue = patrimoine.getValeur(date);

		totalValue = parseFloat(totalValue.toFixed(2));

		res.json({ totalValue });

	} catch (err) {
		res.status(500).json({ message: 'Error calculating patrimoine value: ' + err.message });
	}
});

// Calcule les valeurs du patrimoine entre deux dates
app.post('/patrimoine/range', async (req, res) => {
	try {
		const fileData = fileURLToPath(import.meta.url);
		const dirname = path.dirname(fileData);
		const filePath = path.join(dirname, 'data/data.json');

		const fileContent = await fs.readFile(filePath, 'utf8');
		let jsonData;

		// Check if fileContent is a string and parse it
		if (typeof fileContent === 'string') {
			try {
				jsonData = JSON.parse(fileContent);
			} catch (parseErr) {
				console.error('Error parsing JSON:', parseErr);
				return res.status(500).json({ message: 'Error parsing JSON: ' + parseErr.message });
			}
		} else {
			jsonData = fileContent;
		}

		// Extract patrimoine data
		const patrimoineData = jsonData.find(item => item.model === 'Patrimoine');
		if (!patrimoineData) {
			return res.status(404).json({ message: 'Patrimoine not found' });
		}

		const { possesseur, possessions } = patrimoineData.data;

		// Instantiate possessions
		const possessionInstances = possessions.map(p => {
			if (p.jour && p.valeurConstante !== undefined) {
				return new Flux(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement, p.jour, p.valeurConstante);
			} else {
				return new BienMateriel(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement);
			}
		});

		const patrimoine = new Patrimoine(possesseur, possessionInstances);

		const { startDate, endDate, jour } = req.body;

		if (!startDate || !endDate || !jour) {
			return res.status(400).json({ message: 'Invalid input, please provide startDate, endDate, and jour.' });
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start.getTime()) || isNaN(end.getTime()) || jour < 1 || jour > 31) {
			return res.status(400).json({ message: 'Invalid date format or day, use YYYY-MM-DD for dates and day between 1 and 31.' });
		}

		const results = [];
		let currentDate = new Date(start);

		while (currentDate <= end) {
			const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), jour);

			if (checkDate >= start && checkDate <= end) {
				let totalValue = patrimoine.getValeur(checkDate);
				totalValue = parseFloat(totalValue.toFixed(2));
				results.push({ date: checkDate.toISOString().split('T')[0], totalValue });
			}

			// Move to the next month
			currentDate.setMonth(currentDate.getMonth() + 1);
		}

		res.status(200).json({ values: results });
	} catch (err) {
		console.error('Error calculating patrimoine value:', err);
		res.status(500).json({ message: 'Error calculating patrimoine value.' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});