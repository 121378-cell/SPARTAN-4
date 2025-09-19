require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not found');
console.log('PORT:', process.env.PORT || 3001);