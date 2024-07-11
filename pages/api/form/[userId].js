import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT data FROM form_data WHERE user_id = ?', [userId]);
      if (rows.length > 0) {
        res.status(200).json(rows[0].data);
      } else {
        res.status(404).json({ error: 'User data not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching form data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
