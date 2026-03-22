import { Prisma, type Role } from "@backend/db/index";
import type { RoleDelegate, RoleInclude } from "@backend/generated/prisma/models";
import { CRUD } from "./__basicCRUD";

export abstract class RoleService extends CRUD<Role, RoleDelegate, RoleInclude>(
	Prisma.role,
) {}
