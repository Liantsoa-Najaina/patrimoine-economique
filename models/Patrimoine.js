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

	getValueBetween(startDate, endDate, dayOfMonth) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		let currentDate = new Date(start.getFullYear(), start.getMonth(), dayOfMonth);
		let totalValue = 0;

		while (currentDate <= end) {
			if (currentDate.getDate() === dayOfMonth) {
				totalValue += this.getValeur(currentDate);
			}

			// Move to the next month
			currentDate.setMonth(currentDate.getMonth() + 1);
			if (currentDate.getDate() !== dayOfMonth) {
				currentDate.setDate(dayOfMonth);
			}
		}

		return Math.round(totalValue * 100) / 100;
	}
}
