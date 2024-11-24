import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load() {
	//** @type {{data: App.Store[]}} */
	// @ts-ignore
	//const { data: stores } = await db.from('stores').select('*, store_days (*)');
    //if (stores) {
		//console.log(stores);
		const topDoctors = [
			{ id: 1, name: 'Dr. Ivan Goran Kovačić', rating: 4.8 },
			{ id: 2, name: 'Dr. Dobriša Cesarić', rating: 4.7 },
		];
	
		const popularHospitals = [
			{ id: 1, name: 'Bolnica 1', city: 'Zagreb', doctors: 20 },
			{ id: 2, name: 'Bolnica 2', city: 'Split', doctors: 15 },
		];
	
		const topCities = [
			{ id: 1, name: 'Zagreb', hospitals: 10 },
			{ id: 2, name: 'Split', hospitals: 8 },
		];
	
		return {
			topDoctors,
			popularHospitals,
			topCities,
		};
	//}

	error(404);
}