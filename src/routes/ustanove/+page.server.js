import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    /** @type {{data: App.Institution[]}} */
	// @ts-ignore
	const { data: institutions } = await db.from('institutions').select('*, city (*)');



    /*if (!doctors) {
        throw new Error('Doctor not found');
    }*/

    return { institutions };
}

