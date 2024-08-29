import express from 'express';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import cors from 'cors';
// import {readFile, writeFile} from '../ui/public/data/index.js';
import {readData, writeData} from "./dataService.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../ui/public/data/data.json');

/*const readData = async () => {
    const data = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeData = async (data) => {
    await writeFile(dataFilePath, JSON.stringify(data, null, 2));
};*/

const loadData = () => {
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
};

const data = loadData();

//  GEt /possession: get list of possessions
app.get('/possession', (req, res) => {
    const patrimoine = data.find(item => item.model === 'Patrimoine');
    if (patrimoine && patrimoine.data && patrimoine.data.possessions) {
        res.json(patrimoine.data.possessions);
    } else {
        res.json([]);
    }
});

// POST /possession : Add new possession
app.post('/possession', async (req, res) => {
    try {
        const { libelle, valeur, dateDebut, tauxAmortissement } = req.body;

        if (!libelle || !valeur || !dateDebut || !tauxAmortissement) {
            return res.status(400).json({ status: 400, message: 'Tous les champs sont requis.' });
        }

        const parsedData = await readData();
        const possesseur = parsedData.possesseur;

        if (!possesseur) {
            return res.status(500).json({ status: 500, message: 'Le possesseur est manquant dans les données existantes.' });
        }

        const newPossession = {
            possesseur,
            libelle,
            valeur: parseInt(valeur, 10),
            dateDebut: new Date(dateDebut),
            dateFin: null,
            tauxAmortissement: parseInt(tauxAmortissement, 10),
        };

        parsedData.possessions.push(newPossession);
        await writeData(parsedData);

        res.status(201).json({ status: 201, message: 'Possession ajoutée' });
    } catch (e) {
        console.error('Error adding possession:', e.message); // Log the error message for debugging
        res.status(500).json({ status: 500, message: 'Erreur lors de l\'ajout de la possession : ' + e.message });
    }
});



// PUT /possession/:libelle/update : Update possession by libelle
app.put('/possession/:libelle/update', async (req, res) => {
    try {
        const { libelle } = req.params;
        const { tauxAmortissement } = req.body;

        if (!libelle || !tauxAmortissement) {
            return res.status(400).json({ status: 400, message: 'Tous les champs sont requis.' });
        }

        const parsedData = await readData();
        const possession = parsedData.possessions.find(p => p.libelle === libelle);

        if (!possession) {
            return res.status(404).json({ status: 404, message: 'Possession non trouvée.' });
        }

        possession.tauxAmortissement = parseInt(tauxAmortissement, 10);

        await writeData(parsedData);

        res.status(200).json({ status: 200, message: 'Possession mise à jour' });
    } catch (e) {
        console.error('Error updating possession:', e.message); // Log the error message for debugging
        res.status(500).json({ status: 500, message: 'Erreur lors de la mise à jour de la possession : ' + e.message });
    }
});


// POST /possession/:libelle/close : Set possession's dateFin to current date
app.post('/possession/:libelle/close', async (req, res) => {
    try {
        const { libelle } = req.params;
        const parsedData = await readData();
        const possession = parsedData.possessions.find(p => p.libelle === libelle);

        if (!possession) {
            return res.status(404).json({ status: 404, message: "Possession non trouvée" });
        }

        possession.dateFin = new Date();
        await writeData(parsedData);
        res.status(200).json({ status: 200, message: "Possession clôturée" });
    } catch (e) {
        res.status(500).json({ status: 500, message: 'Erreur lors de la clôture de la possession : ' + e.message });
    }
});

// GET /patrimoine/:date : Get total patrimoine value at a given date
app.get('/patrimoine/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const patrimoineDate = new Date(date);
        const parsedData = await readData();

        let totalValue = 0;
        parsedData.possessions.forEach(possession => {
            const dateDebut = new Date(possession.dateDebut);
            const dateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();

            if (dateDebut <= patrimoineDate && dateFin >= patrimoineDate) {
                totalValue += possession.valeur; // Apply amortisation if needed here
            }
        });

        res.status(200).json({ status: 200, valeurPatrimoine: totalValue });
    } catch (e) {
        res.status(500).json({ status: 500, message: 'Erreur lors de la lecture des données : ' + e.message });
    }
});

// POST /patrimoine/range : Get patrimoine value over a range
app.post('/patrimoine/range', async (req, res) => {
    try {
        const { type, dateDebut, dateFin, jour } = req.body;

        if (!type || !dateDebut || !dateFin || !jour) {
            return res.status(400).json({ status: 400, message: 'Tous les champs sont requis.' });
        }

        const startDate = new Date(dateDebut);
        const endDate = new Date(dateFin);
        const parsedData = await readData();
        const possessions = parsedData.possessions;
        let patrimoineValues = [];

        if (type === 'month') {
            for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
                let totalValue = 0;
                possessions.forEach(possession => {
                    const possessionStart = new Date(possession.dateDebut);
                    const possessionEnd = possession.dateFin ? new Date(possession.dateFin) : new Date();

                    if (possessionStart <= d && possessionEnd >= d) {
                        totalValue += possession.valeur; // Apply amortisation if needed here
                    }
                });
                patrimoineValues.push({ date: new Date(d), valeur: totalValue });
            }
        }

        res.status(200).json({ status: 200, patrimoineValues });
    } catch (e) {
        res.status(500).json({ status: 500, message: 'Erreur lors du calcul du patrimoine : ' + e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
