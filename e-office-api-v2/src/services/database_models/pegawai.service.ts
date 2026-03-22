// pegawai.service.ts

import { Prisma, type Pegawai } from "@backend/db/index";
import type {
	PegawaiDelegate,
	PegawaiInclude,
} from "@backend/generated/prisma/models";
import { CRUD } from "./__basicCRUD";

export abstract class PegawaiService extends CRUD<
	Pegawai,
	PegawaiDelegate,
	PegawaiInclude
>(Prisma.pegawai) {}
