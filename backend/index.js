import express from 'express';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import cors from 'cors';
import {readData, writeData} from "./dataService.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../ui/public/data/data.json');

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
app.post('/possession/create', async (req, res) => {
    console.log('Request body:', req.body);
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
        console.error('Error adding possession:', e.message);
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
        console.error('Error updating possession:', e.message);
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
        const targetDate = new Date(date);

        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ status: 400, message: 'Date invalide.' });
        }

        const parsedData = await readData();
        const possessions = parsedData.possessions;
        let totalValue = 0;

        possessions.forEach(possession => {
            const dateDebut = new Date(possession.dateDebut);
            const dateFin = possession.dateFin ? new Date(possession.dateFin) : null;

            if (dateDebut <= targetDate && (!dateFin || dateFin >= targetDate)) {
                if (possession.libelle === 'Alternance' || possession.libelle === 'Survie') {
                    const monthDiff = (targetDate.getFullYear() - dateDebut.getFullYear()) * 12 + (targetDate.getMonth() - dateDebut.getMonth());
                    totalValue += monthDiff * possession.valeurConstante;
                } else {
                    if (possession.tauxAmortissement) {
                        const yearsElapsed = (targetDate - dateDebut) / (1000 * 60 * 60 * 24 * 365.25);
                        const depreciationFactor = 1 - (possession.tauxAmortissement / 100 * yearsElapsed);
                        totalValue += possession.valeur * Math.max(depreciationFactor, 0);
                    } else {
                        totalValue += possession.valeur;
                    }
                }
            }
        });

        res.status(200).json({ status: 200, totalValue });
    } catch (e) {
        console.error('Error calculating patrimoine:', e.message);
        res.status(500).json({ status: 500, message: 'Erreur lors du calcul du patrimoine : ' + e.message });
    }
});

// POST /patrimoine/range : Get patrimoine value over a range
app.post('/patrimoine/range', async (req, res) => {
    try {
        const { type, startDate, endDate, jour } = req.body;

        if (!startDate || !endDate || !jour || type !== 'month') {
            return res.status(400).json({ status: 400, message: 'Les deux dates, startDate et endDate, ainsi que le jour et le type sont requis.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ status: 400, message: 'Dates invalides. Format de date valide : AAAA-MM-JJ.' });
        }

        if (start > end) {
            return res.status(400).json({ status: 400, message: 'La date de début ne peut pas être après la date de fin.' });
        }

        const parsedData = await readData();
        const possessions = parsedData.possessions;
        let patrimoineOverRange = [];

        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
            const currentDate = new Date(d.getFullYear(), d.getMonth(), jour);

            if (currentDate > end) break;

            let totalValue = 0;

            possessions.forEach(possession => {
                const dateDebut = new Date(possession.dateDebut);
                const dateFin = possession.dateFin ? new Date(possession.dateFin) : null;

                if (dateDebut <= currentDate && (!dateFin || dateFin >= currentDate)) {
                    if (possession.libelle === 'Alternance' || possession.libelle === 'Survie') {
                        const monthDiff = (currentDate.getFullYear() - dateDebut.getFullYear()) * 12 + (currentDate.getMonth() - dateDebut.getMonth());
                        totalValue += monthDiff * possession.valeurConstante;
                    } else {
                        if (possession.tauxAmortissement) {
                            const yearsElapsed = (currentDate - dateDebut) / (1000 * 60 * 60 * 24 * 365.25);
                            const depreciationFactor = 1 - (possession.tauxAmortissement / 100 * yearsElapsed);
                            totalValue += possession.valeur * Math.max(depreciationFactor, 0);
                        } else {
                            totalValue += possession.valeur;
                        }
                    }
                }
            });

            patrimoineOverRange.push({ date: currentDate, totalValue });
        }

        res.status(200).json({ status: 200, patrimoineOverRange });
    } catch (e) {
        console.error('Error calculating patrimoine range:', e.message);
        res.status(500).json({ status: 500, message: 'Erreur lors du calcul de la gamme de patrimoine : ' + e.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
