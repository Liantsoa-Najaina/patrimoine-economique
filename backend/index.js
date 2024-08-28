import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const getFilePath = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '../ui/public/data/data.json');
};

// GET /possession : Get list of possessions
app.get('/possession', async (req, res) => {
    try {
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        res.status(200).json(parsedData);
    } catch (e) {
        res.status(500).json({ message: 'Erreur de lecture des données : ' + e.message });
    }
});

// POST /possession : Add new possession
app.post('/possession', async (req, res) => {
    try {
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        const request = req.body;
        const possesseur = parsedData.possesseur;

        const newPossession = {
            possesseur: possesseur,
            libelle: request.libelle,
            valeur: parseInt(request.valeur, 10),
            dateDebut: new Date(request.dateDebut),
            dateFin: null,
            tauxAmortissement: parseInt(request.tauxAmortissement, 10),
        };

        parsedData.possessions.push(newPossession);

        await writeFile(filePath, JSON.stringify(parsedData, null, 2));
        res.status(201).send('Possession ajoutée');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// PUT /possession/:libelle/update : Update possession by libelle
app.put('/possession/:libelle/update', async (req, res) => {
    try {
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        const { libelle } = req.params;
        const donnees = req.body;

        const possession = parsedData.possessions.find(p => p.libelle === libelle);

        if (possession) {
            possession.libelle = donnees.libelle || possession.libelle;
            possession.dateFin = donnees.dateFin ? new Date(donnees.dateFin) : possession.dateFin;

            await writeFile(filePath, JSON.stringify(parsedData, null, 2));
            res.status(200).json({ message: "Mise à jour des données effectuée" });
        } else {
            res.status(404).json({ message: "Possession non trouvée" });
        }
    } catch (e) {
        res.status(500).json({ message: 'Erreur de lecture du fichier JSON : ' + e.message });
    }
});

// POST /possession/:libelle/close : Set possession's dateFin to current date
app.post('/possession/:libelle/close', async (req, res) => {
    try {
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        const { libelle } = req.params;
        const possession = parsedData.possessions.find(p => p.libelle === libelle);

        if (possession) {
            possession.dateFin = new Date();

            await writeFile(filePath, JSON.stringify(parsedData, null, 2));
            res.status(200).json({ message: "Possession clôturée" });
        } else {
            res.status(404).json({ message: "Possession non trouvée" });
        }
    } catch (e) {
        res.status(500).json({ message: 'Erreur lors de la clôture de la possession : ' + e.message });
    }
});

// GET /patrimoine/:date : Get total patrimoine value at a given date
app.get('/patrimoine/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        const possessions = parsedData.possessions;
        const patrimoineDate = new Date(date);

        // Calculate total value of possessions up to the given date
        let totalValue = 0;
        possessions.forEach(possession => {
            const dateDebut = new Date(possession.dateDebut);
            const dateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();

            if (dateDebut <= patrimoineDate && dateFin >= patrimoineDate) {
                totalValue += possession.valeur;
            }
        });

        res.status(200).json({ valeurPatrimoine: totalValue });
    } catch (e) {
        res.status(500).json({ message: 'Erreur rencontrée lors de la lecture des données : ' + e.message });
    }
});

// GET /patrimoine/range : Get patrimoine value over a range
app.post('/patrimoine/range', async (req, res) => {
    try {
        const { type, dateDebut, dateFin, jour } = req.body;
        const filePath = getFilePath();
        const data = await readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        const possessions = parsedData.possessions;
        const startDate = new Date(dateDebut);
        const endDate = new Date(dateFin);

        let patrimoineValues = [];

        if (type === 'month') {
            for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
                let totalValue = 0;
                possessions.forEach(possession => {
                    const possessionStart = new Date(possession.dateDebut);
                    const possessionEnd = possession.dateFin ? new Date(possession.dateFin) : new Date();

                    if (possessionStart <= d && possessionEnd >= d) {
                        totalValue += possession.valeur;
                    }
                });
                patrimoineValues.push({ date: new Date(d), valeur: totalValue });
            }
        }

        res.status(200).json({ patrimoineValues });
    } catch (e) {
        res.status(500).json({ message: 'Erreur rencontrée lors du calcul des valeurs de patrimoine : ' + e.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
