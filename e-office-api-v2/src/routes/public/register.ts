import { auth } from "@backend/lib/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

const getRoleNameFromEmail = (email: string) => {
	const domain = email.split("@")[1]?.toLowerCase() ?? "";
	if (domain.includes("supervisor")) return "Supervisor Akademik";
	if (domain.includes("spvak")) return "Supervisor Akademik";
	if (domain.includes("mantu")) return "Manajer TU";
	if (domain.includes("manajer")) return "Manajer TU";
	if (domain.includes("upa")) return "UPA";
	return "Mahasiswa";
};

const toTitleCase = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/(^|\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);

export default new Elysia().post(
	"/",
	async ({ body, headers }) => {
		const normalizedName = toTitleCase(body.name);
		const data = await auth.api.signUpEmail({
			body: {
				name: normalizedName,
				email: body.username,
				password: body.password,
				rememberMe: true,
			},
			headers: headers,
		});

		if (data?.user?.id) {
			const roleName = getRoleNameFromEmail(body.username);
			const role =
				(await Prisma.role.findUnique({ where: { name: roleName } })) ??
				(await Prisma.role.create({ data: { name: roleName } }));

			await Prisma.userRole.upsert({
				where: {
					userId_roleId: {
						userId: data.user.id,
						roleId: role.id,
					},
				},
				update: {},
				create: {
					userId: data.user.id,
					roleId: role.id,
				},
			});
		}

		return data;
	},
	{
		body: t.Object({
			name: t.String(),
			username: t.String(),
			password: t.String(),
		}),
	},
);
