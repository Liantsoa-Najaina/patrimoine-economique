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

	/*getValueBetween(startDate, endDate, day) {
		const results = [];
		let currentDate = new Date(startDate);
		endDate = new Date(endDate);

		if (day < 1 || day > 31) {
			throw new Error('Invalid day. It should be between 1 and 31.');
		}

		// Ensure startDate is before endDate
		if (currentDate > endDate) {
			throw new Error('Start date must be before end date.');
		}

		while (currentDate <= endDate) {
			// Create checkDate at the specified day of the current month
			let checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

			// Handle months with fewer days than the specified day
			if (checkDate.getDate() !== day) {
				// Move to the next month if the date is invalid
				currentDate.setMonth(currentDate.getMonth() + 1);
				continue;
			}

			// Log current state
			console.log(`Checking date: ${checkDate.toISOString().split('T')[0]}`);

			// Check if checkDate is within the range
			if (checkDate >= startDate && checkDate <= endDate) {
				console.log(`Date ${checkDate.toISOString().split('T')[0]} is within range.`);
				const totalValue = this.possessions.reduce((total, possession) => {
					// Log possession details
					console.log(`Evaluating possession: ${possession.libelle}`);
					console.log(`  Date debut: ${possession.dateDebut.toISOString().split('T')[0]}`);
					console.log(`  Date fin: ${possession.dateFin ? possession.dateFin.toISOString().split('T')[0] : 'null'}`);

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

				// Log calculated total value
				console.log(`Total value on ${checkDate.toISOString().split('T')[0]}: ${totalValue}`);

				results.push({ date: checkDate.toISOString().split('T')[0], totalValue: parseFloat(totalValue.toFixed(2)) });
			}

			// Move to the next month
			currentDate.setMonth(currentDate.getMonth() + 1);
		}

		// Log results
		console.log('Calculated values:', results);

		if (results.length === 0) {
			console.log('No values found for the specified date range and day.');
		}

		return results;
	}*/


}
