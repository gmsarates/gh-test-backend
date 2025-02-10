const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar nova atividade
router.post('/', async (req, res) => {
    const { name, startTime, endTime } = req.body;
    const query = 'INSERT INTO activities (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await pool.query(query, [name, startTime, endTime]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar atividades
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM activities ORDER BY start_time';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir atividade
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM activities WHERE id = $1';
    try {
        await pool.query(query, [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Relatório de tempo gasto por dia
router.get('/report', async (req, res) => {
    const query = `
        SELECT 
            DATE(start_time) AS day, 
            SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) AS total_hours 
        FROM activities 
        GROUP BY day 
        ORDER BY day;
    `;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;