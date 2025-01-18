import {db} from '$lib/db-server';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params: {id} }) {
    /** @type {{data: App.Doctor}} */
	// @ts-ignore
	const { data: doctor } = await db.from('doctors').select('*, institution (*), city (*)').eq('id', id).limit(1).single();
    if (!doctor) {
        error(404, 'Ne možemo pronaći traženog dijabetologa.');
    }

    /** @type {{data: App.Review[]}} */
	// @ts-ignore
	const { data: reviews } = await db.from('reviews').select('*').eq('doctor', id);

    /*if (!doctor) {
        throw new Error('Doctor not found');
    }*/

    return { doctor, reviews };
}
