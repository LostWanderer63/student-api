const express = require('express');
const pool = require('./db');
const sequelize = require('./sequelize');
const courseRoutes = require('./routes/courses');

const app = express();
app.use(express.json());
app.use('/courses', courseRoutes);

app.post('/students', async (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: 'name, email and age are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    console.log(`INSERT: student ${result.insertId} added (${name}, ${email}, ${age})`);
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log(`UPDATE: student ${id} not found`);
      return res.status(404).json({ error: 'Student not found' });
    }
    const name = req.body.name ?? rows[0].name;
    const email = req.body.email ?? rows[0].email;
    const age = req.body.age ?? rows[0].age;
    await pool.query(
      'UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age, id]
    );
    console.log(`UPDATE: student ${id} updated (${name}, ${email}, ${age})`);
    res.json({ id: Number(id), name, email, age });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log(`DELETE: student ${id} not found`);
      return res.status(404).json({ error: 'Student not found' });
    }
    console.log(`DELETE: student ${id} deleted`);
    res.json({ message: `Student ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
let server;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected to MySQL');
    await sequelize.sync();
    console.log('Sequelize models synced');
  } catch (err) {
    console.error('Sequelize connection failed:', err.message);
    process.exit(1);
  }

  server = app.listen(PORT, (err) => {
    if (err) {
      console.error(`Failed to start server: ${err.message}`);
      process.exit(1);
    }
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

process.on('SIGINT', async () => {
  if (server) server.close();
  await pool.end();
  await sequelize.close();
  console.log('Database connections closed');
  process.exit(0);
});
