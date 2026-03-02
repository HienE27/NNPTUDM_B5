const roleModel = require('../models/roleModel');

// GET /roles - Lấy tất cả Role (không bao gồm đã xóa mềm)
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleModel.findAll();
        res.json({
            success: true,
            count: roles.length,
            data: roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// GET /roles/:id - Lấy Role theo id
const getRoleById = async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                error: 'Role not found',
            });
        }

        res.json({
            success: true,
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// POST /roles - Tạo mới Role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required',
            });
        }

        const newRole = await roleModel.create({ name, description });

        res.status(201).json({
            success: true,
            data: newRole,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: 'Role name already exists',
            });
        }
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// PUT /roles/:id - Cập nhật Role
const updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        const role = await roleModel.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                error: 'Role not found',
            });
        }

        const updatedRole = await roleModel.update(req.params.id, { name, description });

        res.json({
            success: true,
            data: updatedRole,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: 'Role name already exists',
            });
        }
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// DELETE /roles/:id - Xóa mềm Role
const deleteRole = async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                error: 'Role not found',
            });
        }

        const deleted = await roleModel.softDelete(req.params.id);

        if (deleted) {
            const updatedRole = await roleModel.findById(req.params.id);
            res.json({
                success: true,
                message: 'Role soft deleted successfully',
                data: updatedRole,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
