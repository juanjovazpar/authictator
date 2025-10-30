import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default {
  async up(db) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    const user = await db.collection('users').findOne({ email: adminEmail });
    if (!user) {
      const hashed = await hashPassword(adminPassword);
      await db.collection('users').insertOne({
        email: adminEmail,
        password: hashed,
        name: 'admin',
        roles: [],
        isVerified: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  },
  async down(db) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
    await db.collection('users').deleteOne({ email: adminEmail });
  },
};
