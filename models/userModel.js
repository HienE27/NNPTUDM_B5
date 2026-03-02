const { pool } = require('../config/database');

const userModel = {
    async findAll() {
        const [rows] = await pool.query(
            `SELECT u.*, r.name as roleName, r.description as roleDescription 
             FROM users u 
             LEFT JOIN roles r ON u.roleId = r.id 
             WHERE u.deletedAt IS NULL`
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT u.*, r.name as roleName, r.description as roleDescription 
             FROM users u 
             LEFT JOIN roles r ON u.roleId = r.id 
             WHERE u.id = ? AND u.deletedAt IS NULL`,
            [id]
        );
        return rows[0] || null;
    },

    async findByEmailAndUsername(email, username) {
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE email = ? AND username = ? AND deletedAt IS NULL`,
            [email, username]
        );
        return rows[0] || null;
    },

    async create(userData) {
        const { username, password, email, fullName, avatarUrl, roleId } = userData;
        const [result] = await pool.query(
            `INSERT INTO users (username, password, email, fullName, avatarUrl, roleId) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, password, email, fullName || '', avatarUrl || 'https://i.sstatic.net/l60Hf.png', roleId || null]
        );
        return this.findById(result.insertId);
    },

    async update(id, userData) {
        const fields = [];
        const values = [];

        if (userData.fullName !== undefined) {
            fields.push('fullName = ?');
            values.push(userData.fullName);
        }
        if (userData.avatarUrl !== undefined) {
            fields.push('avatarUrl = ?');
            values.push(userData.avatarUrl);
        }
        if (userData.roleId !== undefined) {
            fields.push('roleId = ?');
            values.push(userData.roleId);
        }
        if (userData.loginCount !== undefined) {
            fields.push('loginCount = ?');
            values.push(Math.max(0, userData.loginCount));
        }
        if (userData.status !== undefined) {
            fields.push('status = ?');
            values.push(userData.status ? 1 : 0);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deletedAt IS NULL`,
            values
        );
        return this.findById(id);
    },

    async softDelete(id) {
        const [result] = await pool.query(
            `UPDATE users SET deletedAt = NOW() WHERE id = ? AND deletedAt IS NULL`,
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = userModel;
