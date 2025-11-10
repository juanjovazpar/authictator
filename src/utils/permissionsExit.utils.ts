import { ObjectId } from 'mongoose';

import { Permission } from '../models';

export const ensurePermissionsExist = async (permissions: string[]): Promise<ObjectId[]> => {
  await Permission.bulkWrite(
    permissions.map((name) => ({
      updateOne: {
        filter: { name, deletedAt: null },
        update: { $setOnInsert: { name, deletedAt: null } },
        upsert: true,
      },
    })),
  );

  const permissionsDocs: ObjectId[] = await Permission.find(
    { name: { $in: permissions } },
    { _id: 1 },
  );

  return permissionsDocs;
};
