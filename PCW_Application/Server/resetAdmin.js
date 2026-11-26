require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Change to 'bcrypt' if you use bcrypt
const User = require('./models/User'); // Adjust path if needed

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Use your exact .env variable name

    const adminEmail = 'hod@vnsgu.edu'; // Replace with your exact admin email
    const newPassword = 'Admin123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updated = await User.findOneAndUpdate(
      { email: adminEmail },
      { passwordHash: hashedPassword },
      { new: true }
    );

    if (!updated) {
      console.log('Admin user not found. Check the email address.');
    } else {
      console.log(`Password successfully reset for ${updated.email}`);
      console.log(`New Password: ${newPassword}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

resetPassword();