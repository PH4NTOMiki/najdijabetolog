import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server';

export async function PATCH({ params, request }) {
    const { id } = params;
    const data = await request.json();

    try {
        const { error } = await db.from('doctors').update(data).eq('id', id);
        if (error) {
            return json({ error: `Greška prilikom ažuriranja dijabetologa: ${error.message}` }, { status: 500 });
        }
        return json({ message: 'Dijabetolog uspješno azuriran!' });
    } catch (error) {
        return json({ error: 'Neočekivana greška.' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    const { id } = params;
    try {
        const { error } = await db.from('doctors').delete().eq('id', id);
        if (error) {
            return json({ error: `Greška prilikom brisanja dijabetologa: ${error.message}` }, { status: 500 });
        }
        return json({ message: 'Dijabetolog uspješno izbrisan!' });
    } catch (error) {
        return json({ error: 'Neočekivana greška.' }, { status: 500 });
    }
}
