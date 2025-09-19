const { User } = require('./database/models');

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    const users = await User.findAll();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.username}`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();