import { json, error } from '@sveltejs/kit';
import {db} from '$lib/db-server';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	/** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)');


	return json(doctors);
}

export async function POST({ request }) {
    const _data = await request.json();

    try {
        const { data, error } = await db.from('doctors').insert(_data).select().single();
        if (error) {
            return json({ error: `Greška prilikom dodavanja dijabetologa: ${error.message}` }, { status: 500 });
        }
        return json({ message: 'Dijabetolog uspješno dodan!' });
    } catch (error) {
        return json({ error: 'Neočekivana greška.' }, { status: 500 });
    }
}