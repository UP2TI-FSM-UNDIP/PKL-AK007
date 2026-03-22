import { type LetterType, Prisma } from "@backend/db/index";
import { CRUD } from "./__basicCRUD";
import type {
	LetterTypeInclude,
	LetterTypeDelegate,
	LetterTypeCreateInput,
	LetterTypeUpdateInput,
} from "@backend/generated/prisma/models";

export abstract class LetterTypeService extends CRUD<
	LetterType,
	LetterTypeDelegate,
	LetterTypeInclude
>(Prisma.letterType) {
	public static async getAllLetterVersion(id: string) {
		const letterTemplates = await LetterTypeService.get(id, {
			include: {
				templates: true,
			},
		});

		return letterTemplates;
	}

	public static create(data: LetterTypeCreateInput) {
		return Prisma.letterType.create({ data: data });
	}

	public static update(id: string, data: LetterTypeUpdateInput) {
		return Prisma.letterType.update({
			where: { id: id },
			data: data,
		});
	}
}
