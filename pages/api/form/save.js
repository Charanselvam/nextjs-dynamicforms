import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, formData } = req.body;

    try {
      const [result] = await pool.query('INSERT INTO form_data (user_id, data) VALUES (?, ?)', [userId, JSON.stringify(formData)]);
      res.status(200).json({ id: result.insertId, message: 'Form data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving form data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
