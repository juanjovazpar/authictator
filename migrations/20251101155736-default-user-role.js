const DEFAULT_ROLE = process.env.DEFAULT_ROLE || 'user:default';

export default {
  async up(db) {
    const role = await db.collection('roles').findOne({ name: DEFAULT_ROLE });
    if (!role) {
      await db.collection('roles').insertOne({
        name: DEFAULT_ROLE,
        permissions: [],
      });
      console.log('✅ Default role for new users created');
    } else {
      console.log('ℹ️ Default role for new users exists');
    }
  },
  async down(db) {
    await db.collection('roles').deleteOne({ name: DEFAULT_ROLE });
  },
};
