import Possession from "./possessions/Possession.js";
import BienMateriel from "./possessions/BienMateriel.js";
import Flux from "./possessions/Flux.js";

export default class Patrimoine {
	constructor(possesseur, possessions) {
		this.possesseur = possesseur;
		this.possessions = [...possessions]; // [Possession, Possession, ...]
	}
	getValeur(date) {
		let result = 0;
		for (const item of this.possessions) {
			result += item.getValeur(date);
		}
		return result;
	}
	addPossession(possession) {
		if (possession.possesseur !== this.possesseur) {
			console.log(
				`${possession.libelle} n'appartient pas à ${this.possesseur}`,
			);
		} else {
			this.possessions.push(possession);
		}
	}
	removePossession(possession) {
		this.possessions = this.possessions.filter(
			(p) => p.libelle !== possession.libelle,
		);
	}

	getValueBetween(startDate, endDate, day) {
		const results = [];
		let currentDate = new Date(startDate);
		endDate = new Date(endDate);

		if (day < 1 || day > 31) {
			throw new Error('Invalid day. It should be between 1 and 31.');
		}

		while (currentDate <= endDate) {
			const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

			if (checkDate >= startDate && checkDate <= endDate) {
				const totalValue = this.possessions.reduce((total, possession) => {
					if ((possession.dateDebut <= checkDate) && (!possession.dateFin || possession.dateFin >= checkDate)) {
						let value = possession.valeur;

						if (possession.tauxAmortissement) {
							const months = (checkDate.getFullYear() - possession.dateDebut.getFullYear()) * 12 + (checkDate.getMonth() - possession.dateDebut.getMonth());
							value -= value * (possession.tauxAmortissement / 100) * months;
						}

						total += value;
					}
					return total;
				}, 0);

				results.push({ date: checkDate.toISOString().split('T')[0], totalValue: parseFloat(totalValue.toFixed(2)) });
			}

			currentDate.setMonth(currentDate.getMonth() + 1);
		}

		return results;
	}
}
