import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server';

export async function PATCH({ params, request }) {
    const { id } = params;
    const data = await request.json();

    try {
        const { error } = await db.from('reviews').update(data).eq('id', id);
        if (error) {
            return json({ error: `Failed to update review: ${error.message}` }, { status: 500 });
        }
        return json({ message: 'Review updated successfully!' });
    } catch (error) {
        return json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    const { id } = params;
    try {
        const { error } = await db.from('reviews').delete().eq('id', id);
        if (error) {
            return json({ error: `Failed to delete review: ${error.message}` }, { status: 500 });
        }
        return json({ message: 'Review deleted successfully!' });
    } catch (error) {
        return json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
