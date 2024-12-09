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
    const { id, uuid: _, email: __, rating: ___, ...reviewData } = tempReview; // Remove sensitive fields
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
