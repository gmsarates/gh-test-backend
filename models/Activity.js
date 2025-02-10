const pool = require('../db');

class Activity {
    constructor(id = null, name, startTime, endTime) {
        this.id = id;
        this.name = name;
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
    }

    get elapsedTime() {
        const duration = (this.endTime - this.startTime) / 1000;
        let hours = Math.floor(duration / 3600);
        let minutes = Math.floor((duration % 3600) / 60);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes}`;
    }

    static async create(activity) {
        const query = 'INSERT INTO activities (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [activity.name, activity.startTime, activity.endTime]);
        return new Activity(result.rows[0].id, result.rows[0].name, result.rows[0].start_time, result.rows[0].end_time);
    }

    static async findAll() {
        const query = 'SELECT * FROM activities ORDER BY start_time';
        const result = await pool.query(query);
        return result.rows.map(row => new Activity(row.id, row.name, row.start_time, row.end_time));
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