// permission.service.ts

import { Prisma, type Permission } from "@backend/db/index";
import type {
	PermissionDelegate,
	PermissionInclude,
} from "@backend/generated/prisma/models";
import { CRUD } from "./__basicCRUD";

export abstract class PermissionService extends CRUD<
	Permission,
	PermissionDelegate,
	PermissionInclude
>(Prisma.permission) {}
