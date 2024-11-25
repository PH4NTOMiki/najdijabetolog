import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	/** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)');
    //if (doctors) {
		console.log('doctors', doctors);
		const topDoctors = doctors.sort((a, b) => b.ratings - a.ratings).slice(0, 10);

		/** @type {{data: App.Institution[]}} */
		// @ts-ignore
		const { data: institutions } = await db.from('institutions').select('*, city (*)');

		/** @type {{data: App.City[]}} */
		// @ts-ignore
		const { data: cities } = await db.from('cities').select('*');
	
		return {
			topDoctors,
			popularInstitutions: institutions,
			topCities: cities,
		};
	//}

	error(404);
}