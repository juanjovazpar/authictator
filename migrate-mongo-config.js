const config = {
  mongodb: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017',
    databaseName: "authicator",
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

export default config;