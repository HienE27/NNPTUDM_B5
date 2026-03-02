const userModel = require('../models/userModel');

// GET /users - Lấy tất cả User (không bao gồm đã xóa mềm)
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// GET /users/:id - Lấy User theo id
const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// POST /users - Tạo mới User
const createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, roleId } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: 'Username, password and email are required',
            });
        }

        const newUser = await userModel.create({
            username,
            password,
            email,
            fullName,
            avatarUrl,
            roleId
        });

        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.message.includes('username') ? 'username' : 'email';
            return res.status(400).json({
                success: false,
                error: `${field} already exists`,
            });
        }
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// PUT /users/:id - Cập nhật User
const updateUser = async (req, res) => {
    try {
        const { fullName, avatarUrl, roleId, loginCount } = req.body;

        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        const updatedUser = await userModel.update(req.params.id, {
            fullName,
            avatarUrl,
            roleId,
            loginCount
        });

        res.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// DELETE /users/:id - Xóa mềm User
const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        if (user.deletedAt) {
            return res.status(400).json({
                success: false,
                error: 'User already deleted',
            });
        }

        const deleted = await userModel.softDelete(req.params.id);

        if (deleted) {
            const updatedUser = await userModel.findById(req.params.id);
            res.json({
                success: true,
                message: 'User soft deleted successfully',
                data: updatedUser,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// POST /users/enable - Bật trạng thái user
const enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                success: false,
                error: 'Email and username are required',
            });
        }

        const user = await userModel.findByEmailAndUsername(email.toLowerCase(), username);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found with provided email and username',
            });
        }

        const updatedUser = await userModel.update(user.id, { status: true });

        res.json({
            success: true,
            message: 'User enabled successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// POST /users/disable - Tắt trạng thái user
const disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                success: false,
                error: 'Email and username are required',
            });
        }

        const user = await userModel.findByEmailAndUsername(email.toLowerCase(), username);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found with provided email and username',
            });
        }

        const updatedUser = await userModel.update(user.id, { status: false });

        res.json({
            success: true,
            message: 'User disabled successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    enableUser,
    disableUser
};
