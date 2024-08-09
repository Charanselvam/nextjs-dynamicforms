import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT user_id, data FROM form_data');

      if (rows.length > 0) {
        const matches = rows.map(row => {
          let parsedData;
          try {
            parsedData = JSON.parse(row.data); // Try parsing the data
          } catch (parseError) {
            console.error('Error parsing JSON for user:', row.user_id, parseError);
            parsedData = row.data; // Use the raw data if parsing fails
          }

          return {
            userId: row.user_id,
            data: parsedData
          };
        });

        res.status(200).json(matches);
      } else {
        res.status(404).json({ error: 'No matches found' });
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ error: 'Error fetching matches' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
