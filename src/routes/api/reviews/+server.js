import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server'; // Adjust according to your database setup

export async function POST({ request }) {
    console.log('POST request received');
    const { doctor_id, email, institution_id, ratingskill, ratingkindness, ratingethicality, ratinginstitution, comment, created_by } = await request.json();

    if (!doctor_id || !email || !institution_id || !ratingskill || !ratingkindness || !ratingethicality || !ratinginstitution || !comment || !created_by) {
        return json({ error: 'Molimo popunite sva polja' }, { status: 400 });
    }

    // Check if the email already exists in the reviews table
    const { data: existingReviews, error: existingReviewError } = await db.from('reviews').select('*').eq('email', email).eq('doctor', doctor_id);
    if (existingReviewError) {
        console.error('Error checking existing review:', existingReviewError);
        return json({ error: 'Greška, molimo pokušajte ponovo' }, { status: 500 });
    }

    if (existingReviews && existingReviews.length) {
        return json({ error: 'Već ste ostavili dojam za ovog doktora' }, { status: 400 });
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
        return json({ error: 'Greška' }, { status: 500 });
    }

    console.log('Review inserted:', data);
    const fetchRes = await fetch(`https://www.nainzulinu.com/sendimejl.php?from=info@najdijabetolog.com&email=${email}&subject=Povrdite ostavljanje dojma&auth=mypwd1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: `Molimo potvrdite ostavljanje recenzije na <a href="${dev?'http://localhost:3000':'https://najdijabetolog.com'}/api/confirm?token=${data.uuid}&email=${email}">linku</a>.<br><br>Hvala,<br>NajDijabetolog.com`
    });
    console.log(fetchRes, await fetchRes.text());

    return json(data);
}
