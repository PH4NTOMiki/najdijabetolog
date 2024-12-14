import { json, error } from '@sveltejs/kit';
import {db} from '$lib/db-server';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	/** @type {{data: App.Doctor[]}} */
	// @ts-ignore
	const { data: doctors } = await db.from('doctors').select('*, institution (*), city (*)');


	return json(doctors);
}