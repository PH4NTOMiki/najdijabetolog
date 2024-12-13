import { json, redirect } from '@sveltejs/kit';
import {db} from '$lib/db-server';

export async function GET({ url }) {
    const uuid = url.searchParams.get('token');
    const email = url.searchParams.get('email');
    //console.log(uuid, email);

    if (!uuid || !email) {
        return json({ success: false, message: 'Neuspješno' }, { status: 400 });
    }

    // Step 1: Find the review in `reviews_temp`
    const { data: tempReview, error: fetchError } = await db
        .from('reviews_temp')
        .select('*')
        .eq('uuid', uuid)
        .eq('email', email)
        .single();
    //console.log(tempReview, fetchError);

    if (fetchError || !tempReview) {
        return json({ success: false, message: 'Problem' }, { status: 404 });
    }

    // Step 2: Insert the review into `reviews`
    const { id, uuid: _, rating: ___, ...reviewData } = tempReview; // Remove sensitive fields
    console.log(reviewData);

    // Check if the email already exists in the reviews table
    const { data: existingReviews, error: existingReviewError } = await db.from('reviews').select('*').eq('email', email).eq('doctor', reviewData.doctor);
    if (existingReviewError) {
        console.error('Error checking existing review:', existingReviewError);
        return json({ success: false, message: 'Greška, molimo pokušajte ponovo' }, { status: 500 });
    }

    if (existingReviews && existingReviews.length) {
        return json({ success: false, message: 'Već ste ostavili dojam za ovog doktora' }, { status: 400 });
    }

    const { error: insertError } = await db.from('reviews').insert(reviewData);
    console.log(insertError);

    if (insertError) {
        return json({ success: false, message: 'Problemi' }, { status: 500 });
    }

    // Step 3: Delete the review from `reviews_temp`
    const { error: deleteError } = await db
        .from('reviews_temp')
        .delete()
        .eq('id', id);

    if (deleteError) {
        return json({
            success: true,
            message: 'Review confirmed but failed to clean up temporary entry',
        });
    }

    redirect(301, `/doktori/${tempReview.doctor}`);
}
