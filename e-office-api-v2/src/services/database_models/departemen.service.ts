import { Departemen, Prisma } from "@backend/db/index";
import { CRUD } from "./__basicCRUD";
import type {
	DepartemenDelegate,
	DepartemenInclude,
	DepartemenUncheckedCreateInput,
} from "@backend/generated/prisma/models";

export abstract class DepartemenService extends CRUD<
	Departemen,
	DepartemenDelegate,
	DepartemenInclude
>(Prisma.departemen) {
	public static create(data: DepartemenUncheckedCreateInput) {
		return Prisma.departemen.create({
			data: data,
		});
	}

	public static update(id: string, data: DepartemenUncheckedCreateInput) {
		return Prisma.departemen.update({
			where: { id: id },
			data: data,
		});
	}
}
