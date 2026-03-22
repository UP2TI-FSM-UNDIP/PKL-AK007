import { Prisma, type User } from "@backend/db/index";
import { CRUD } from "./__basicCRUD";
import type {
	UserCreateInput,
	UserDelegate,
	UserInclude,
	UserUpdateInput,
} from "@backend/generated/prisma/models";

export abstract class UserService extends CRUD<User, UserDelegate, UserInclude>(
	Prisma.user,
) {
	public static create(data: UserCreateInput) {
		return Prisma.user.create({ data: data });
	}

	public static update(id: string, data: UserUpdateInput) {
		return Prisma.user.update({
			where: { id: id },
			data: data,
		});
	}
}
