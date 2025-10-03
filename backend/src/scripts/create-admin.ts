import { connectDatabase } from '../db/connection.js';
import { User } from '../db/models/index.js';
import { hashPassword } from '../utils/auth.js';

async function createAdmin() {
  try {
    await connectDatabase();
    
    const adminEmail = process.argv[2] || 'admin@physics-school.com';
    const adminPassword = process.argv[3] || 'admin123';
    
    console.log(`Creating admin user with email: ${adminEmail}`);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    
    // Create admin user
    const passwordHash = await hashPassword(adminPassword);
    
    const admin = new User({
      name: 'Admin User',
      phone: '+976-9999-9999',
      email: adminEmail,
      grade: 'EESH',
      goals: ['admin', 'management'],
      passwordHash,
      roles: ['admin'],
      subscriptionStatus: 'active',
      emailVerifiedAt: new Date()
    });
    
    await admin.save();
    
    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('You can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
