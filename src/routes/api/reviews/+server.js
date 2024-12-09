import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server'; // Adjust according to your database setup

export async function POST({ request }) {
    console.log('POST request received');
    const { doctor_id, email, institution_id, ratingskill, ratingkindness, ratingethicality, ratinginstitution, comment, created_by } = await request.json();

    if (!doctor_id || !created_by) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const {data, error:_error} = await db.from('reviews_temp').insert({
        doctor: doctor_id,
        email,
        institution: institution_id,
        ratingskill,
        ratingkindness,
        ratingethicality,
        ratinginstitution,
        comment,
        created_by
    }).select().single();

    if (_error) {
        console.error('Error inserting review:', _error);
        return json({ error: 'Failed to insert review' }, { status: 500 });
    }

    console.log('Review inserted:', data);
    await fetch(`https://www.nainzulinu.com/sendimejl.php?from=info@najdijabetolog.com&email=${email}&auth=mypwd1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: `Molimo potvrdite ostavljanje recenzije na <a href="${dev?'http://localhost:3000':'https://najdijabetolog.com'}/api/confirm?token=${data.uuid}&email=${email}">linku</a>.<br><br>Hvala,<br>NajDijabetolog.com`
    });

    return json(data);
}
