import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	/** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)').order('rating', {ascending: false});
    //if (doctors) {;

		/** @type {{data: App.Institution[]}} */
		// @ts-ignore
		const { data: institutions } = await db.from('institutions').select('*, city (*)');

		/** @type {{data: App.City[]}} */
		// @ts-ignore
		const { data: cities } = await db.from('cities').select('*');
	
		return {
			topDoctors: doctors,
			popularInstitutions: institutions,
			topCities: cities,
		};
	//}

	error(404);
}