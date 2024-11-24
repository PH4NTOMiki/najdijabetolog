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
			{ id: 1, name: 'Dr. Alice Johnson', specialization: 'Cardiology', rating: 4.8 },
			{ id: 2, name: 'Dr. Bob Smith', specialization: 'Orthopedics', rating: 4.7 },
		];
	
		const popularHospitals = [
			{ id: 1, name: 'City Hospital', city: 'New York', doctors: 20 },
			{ id: 2, name: 'Green Valley Clinic', city: 'Los Angeles', doctors: 15 },
		];
	
		const topCities = [
			{ id: 1, name: 'New York', hospitals: 10 },
			{ id: 2, name: 'Los Angeles', hospitals: 8 },
		];
	
		return {
			topDoctors,
			popularHospitals,
			topCities,
		};
	//}

	error(404);
}