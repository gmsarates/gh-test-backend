const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Criar nova atividade
router.post('/', async (req, res) => {
    const { name, startTime, endTime } = req.body;
    const activity = new Activity(name, startTime, endTime);
    try {
        const newActivity = await Activity.create(activity);
        res.status(201).json(newActivity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar atividades
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities.map(activity => ({
            name: activity.name,
            startTime: activity.startTime,
            endTime: activity.endTime,
            elapsedTime: activity.elapsedTime // Adicionando o elapsedTime ao resultado
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Excluir atividade
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Activity.deleteById(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Relatório de tempo gasto por dia
router.get('/report', async (req, res) => {
    try {
        const report = await Activity.getReport();
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;