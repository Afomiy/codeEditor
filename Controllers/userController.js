const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) throw new Error('Invalid email or password');
        
        res.send('Login successful');
        res.redirect('dashboard')
    } catch (err) {
        res.status(401).send(err.message);
    }
};

exports.getSignupPage = (req, res) => {
    res.render('signup');
};

exports.signupUser = async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    try {
        await user.save();
        
        res.send('Signup successful');
        res.redirect('dashboard')
    } catch (err) {
        res.status(400).send(err.message);
    }
};
