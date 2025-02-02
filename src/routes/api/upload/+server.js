import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server';

export const POST = async ({ request }) => {
  // Get the form data from the request
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    return json({ message: 'Uploaded file is not an image.' }, { status: 400 });
  }

  // Generate a unique file name (using a timestamp here)
  const fileName = `${Date.now()}_${file.name}`;

  // Convert the File into a Node Buffer.
  // (This is required because the Supabase client running on the server expects a Buffer or Blob.)
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload the file to the specified bucket.
  const { data, error } = await db.storage
    .from('profile-pics') // Replace with your bucket name.
    .upload(fileName, buffer, {
      contentType: file.type
    });

  if (error) {
    console.error('error', error);
    return json({ message: error.message }, { status: 500 });
  }

  console.log('data', data);
  return json({ message: 'File uploaded successfully!', data });
};
