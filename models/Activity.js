const pool = require('../db');

class Activity {
    constructor(name, startTime, endTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    static async create(activity) {
        const query = 'INSERT INTO activities (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [activity.name, activity.startTime, activity.endTime]);
        return result.rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM activities ORDER BY start_time';
        const result = await pool.query(query);
        return result.rows;
    }

    static async deleteById(id) {
        const query = 'DELETE FROM activities WHERE id = $1';
        await pool.query(query, [id]);
    }

    static async getReport() {
        const query = `
            SELECT 
                DATE(start_time) AS day, 
                SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) AS total_hours 
            FROM activities 
            GROUP BY day 
            ORDER BY day;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = Activity;