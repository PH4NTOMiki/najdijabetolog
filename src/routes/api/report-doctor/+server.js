import { json } from '@sveltejs/kit';
import { db } from '$lib/db'; // Adjust to your actual database connection path

export async function POST({ request }) {
  try {
    const { doctorName, issueType, description, reporterEmail } = await request.json();

    // Validate input
    if (!doctorName || !issueType || !description) {
      return json(
        { message: 'Doctor name, issue type, and description are required.' },
        { status: 400 }
      );
    }

    // Insert the report into the database
    /*await db('reports').insert({
      doctor_name: doctorName,
      issue_type: issueType,
      description,
      reporter_email: reporterEmail || null, // Optional field
      created_at: new Date() // Add timestamp
    });*/
    // For now, just log the report to the console
    console.log('Report submitted:', { doctorName, issueType, description, reporterEmail });

    return json({ message: 'Report submitted successfully.' });
  } catch (error) {
    console.error('Error processing report:', error);
    return json(
      { message: 'An error occurred while processing the report. Please try again later.' },
      { status: 500 }
    );
  }
}
