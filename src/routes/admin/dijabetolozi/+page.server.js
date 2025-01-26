import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    /** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)');

    /*if (!doctors) {
        throw new Error('Doctor not found');
    }*/

    return { doctors };
}
