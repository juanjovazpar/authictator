const ADMIN_ROLE = process.env.ADMIN_ROLE_NAME || 'admin';

export default {
  async up(db) {
    const role = await db.collection('roles').findOne({ name: ADMIN_ROLE });
    if (!role) {
      await db.collection('roles').insertOne({
        name: ADMIN_ROLE,
        permissions: [],
      });
      console.log('✅ Default role for admins created');
    } else {
      console.log('ℹ️ Default role for admins exists');
    }
  },
  async down(db) {
    await db.collection('roles').deleteOne({ name: ADMIN_ROLE });
  },
};