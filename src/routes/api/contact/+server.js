import { EMAIL_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Process the data (e.g., save to a database, send an email, etc.)
    console.log('New Contact Form Submission:', { name, email, message });
    const fetchRes = await fetch(`https://www.nainzulinu.com/sendimejl.php?from=info@najdijabetolog.com&email=info@nainzulinu.com&replyto=${email}&subject=Nova poruka sa kontakt forme&auth=${EMAIL_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: `
        <p>Nova poruka sa kontakt forme:</p>
        <br>
        <p>Ime: ${name}</p>
        <p>Email: ${email}</p>
        <p>Poruka: ${message}</p>
        `
    });
    console.log(fetchRes, await fetchRes.text());

    return json({ message: 'Uspješno poslano!' });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
