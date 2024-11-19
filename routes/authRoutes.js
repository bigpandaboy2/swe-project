const express = require('express');
const { registerFarmer, registerBuyer, login, adminLogin, passwordRecovery, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register/farmer', registerFarmer);
router.post('/register/buyer', registerBuyer);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/password-recovery', passwordRecovery);
router.post('/reset-password', resetPassword);

router.get('/admin/dashboard', authMiddleware.isAdmin, (req, res) => {
    res.send('Admin Dashboard');
});

router.get('/farmer/dashboard', authMiddleware.isFarmer, (req, res) => {
    res.send('Farmer Dashboard');
});

router.get('/buyer/dashboard', authMiddleware.isBuyer, (req, res) => {
    res.send('Buyer Dashboard');
});

module.exports = router;
