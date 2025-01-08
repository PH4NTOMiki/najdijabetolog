import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params: {id} }) {
    /** @type {{data: App.Institution}} */
	// @ts-ignore
	const { data: institution } = await db.from('institutions').select('*, city (*)').eq('id', id).limit(1).single();
    if (!institution) {
        error(404, 'Ne možemo pronaći traženu ustanovu.');
    }

    /** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)').eq('institution', id);

    /*if (!doctor) {
        throw new Error('Doctor not found');
    }*/

    return { institution, doctors };
}
