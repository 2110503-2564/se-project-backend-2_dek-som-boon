const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cannot retrieve users' });
    }
};

// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cannot retrieve user' });
    }
};


// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private (Admin only)
exports.createUser = async (req, res, next) => {
    try {
        const { name, username, email, password, tel, role } = req.body;

        // Check if all required fields are provided
        if (!name || !username || !email || !password || !tel) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if email or username already exists
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }, { tel }] 
          });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email or username already exists' });
        }

        // Create new user
        const newUser = await User.create({
            name,
            username,
            email,
            password,
            tel,
            role
        });

        // Return response
        res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
};


// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { email, username, tel } = req.body;

        // Build dynamic query only for fields that exist
        const query = { _id: { $ne: req.params.id } };
        const conditions = [];
        
        if (email) conditions.push({ email });
        if (username) conditions.push({ username });
        if (tel) conditions.push({ tel });

        if (conditions.length > 0) {
            query.$or = conditions;
        }

        if (conditions.length > 0) {
            const userExists = await User.findOne(query);
            if (userExists) {
                return res.status(400).json({ success: false, message: 'Email, username, or phone number already exists' });
            }
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cannot update user' });
    }
};



// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Cannot delete user' });
    }
};
