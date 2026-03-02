const { pool } = require('../config/database');

const roleModel = {
    async findAll() {
        const [rows] = await pool.query(
            `SELECT * FROM roles WHERE deletedAt IS NULL`
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM roles WHERE id = ? AND deletedAt IS NULL`,
            [id]
        );
        return rows[0] || null;
    },

    async create(roleData) {
        const { name, description } = roleData;
        const [result] = await pool.query(
            `INSERT INTO roles (name, description) VALUES (?, ?)`,
            [name, description || '']
        );
        return this.findById(result.insertId);
    },

    async update(id, roleData) {
        const fields = [];
        const values = [];

        if (roleData.name !== undefined) {
            fields.push('name = ?');
            values.push(roleData.name);
        }
        if (roleData.description !== undefined) {
            fields.push('description = ?');
            values.push(roleData.description);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE roles SET ${fields.join(', ')} WHERE id = ? AND deletedAt IS NULL`,
            values
        );
        return this.findById(id);
    },

    async softDelete(id) {
        const [result] = await pool.query(
            `UPDATE roles SET deletedAt = NOW() WHERE id = ? AND deletedAt IS NULL`,
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = roleModel;
