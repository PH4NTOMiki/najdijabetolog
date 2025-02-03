import { json } from '@sveltejs/kit';
import {db} from '$lib/db-server';

export const POST = async ({ request }) => {
  // Get the form data from the request
  const formData = await request.formData();
  const file = formData.get('image');
  const doctorId = formData.get('doctorId');

  if (!file || !(file instanceof File)) {
    return json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    return json({ message: 'Uploaded file is not an image.' }, { status: 400 });
  }

  // Generate a unique file name (using a timestamp here)
  let fileName = `${Date.now()}`;if(!file.name.includes('.')){fileName += '.jpg';}else{fileName += file.name.substring(file.name.lastIndexOf('.'));}
  console.log('fileName', fileName);

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
  // Update the doctor's profile picture in the database
  const imgUrl = db.storage.from('profile-pics').getPublicUrl(data.path).data.publicUrl;
  console.log('imgUrl', imgUrl);
  console.log(await db.from('doctors').update({ profile_picture: imgUrl }).eq('id', doctorId));
  return json({ message: 'File uploaded successfully!', data, imageUrl: imgUrl });
};
