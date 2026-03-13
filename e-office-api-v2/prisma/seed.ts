import { randomUUID } from "crypto";

import { PrismaClient } from "@backend/generated/prisma/client.ts";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();
const Status = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD ?? "password123";

async function ensureCredentialAccount(
  userId: string,
  email: string,
  password: string,
) {
  const existing = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
  });
  if (existing?.password && existing.accountId === email && existing.password.includes(":")) {
    return;
  }
  const hash = await hashPassword(password);
  if (existing) {
    await prisma.account.update({
      where: { id: existing.id },
      data: { password: hash, accountId: email },
    });
    return;
  }
  await prisma.account.create({
    data: {
      id: randomUUID(),
      accountId: email,
      providerId: "credential",
      userId,
      password: hash,
    },
  });
}

async function main() {
  // Roles
  const mahasiswaRole = await prisma.role.upsert({
    where: { name: "Mahasiswa" },
    update: {},
    create: { name: "Mahasiswa" },
  });
  const supervisorRole = await prisma.role.upsert({
    where: { name: "Supervisor Akademik" },
    update: {},
    create: { name: "Supervisor Akademik" },
  });
  const manajerRole = await prisma.role.upsert({
    where: { name: "Manajer TU" },
    update: {},
    create: { name: "Manajer TU" },
  });
  const upaRole = await prisma.role.upsert({
    where: { name: "UPA" },
    update: {},
    create: { name: "UPA" },
  });
  const superadminRole = await prisma.role.upsert({
    where: { name: "Superadmin" },
    update: {},
    create: { name: "Superadmin" },
  });
  

  // Departemen & Prodi
  const departemen = await prisma.departemen.upsert({
    where: { code: "FMIPA" },
    update: {},
    create: { name: "Fakultas Sains dan Matematika", code: "FMIPA" },
  });
  const prodi = await prisma.programStudi.upsert({
    where: { code: "INF" },
    update: {},
    create: { name: "Informatika", code: "INF", departemenId: departemen.id },
  });

  // Users
  const mahasiswaUser = await prisma.user.upsert({
    where: { email: "mahasiswa@ak007.test" },
    update: {},
    create: {
      name: "Ahmad Douglas",
      email: "mahasiswa@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: mahasiswaUser.id, roleId: mahasiswaRole.id } },
    update: {},
    create: { userId: mahasiswaUser.id, roleId: mahasiswaRole.id },
  });
  await prisma.mahasiswa.upsert({
    where: { userId: mahasiswaUser.id },
    update: {},
    create: {
      userId: mahasiswaUser.id,
      nim: "24060121130063",
      tahunMasuk: "2024",
      noHp: "081234567890",
      alamat: "Semarang, Jawa Tengah",
      tempatLahir: "Blora",
      tanggalLahir: new Date("2006-03-18"),
      departemenId: departemen.id,
      programStudiId: prodi.id,
    },
  });
  const mahasiswaUser2 = await prisma.user.upsert({
    where: { email: "mahasiswa2@ak007.test" },
    update: {},
    create: {
      name: "Ahmad Syaflullah",
      email: "mahasiswa2@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: mahasiswaUser2.id, roleId: mahasiswaRole.id } },
    update: {},
    create: { userId: mahasiswaUser2.id, roleId: mahasiswaRole.id },
  });
  await prisma.mahasiswa.upsert({
    where: { userId: mahasiswaUser2.id },
    update: {},
    create: {
      userId: mahasiswaUser2.id,
      nim: "24060121120019",
      tahunMasuk: "2024",
      noHp: "081234567891",
      alamat: "Semarang, Jawa Tengah",
      tempatLahir: "Blora",
      tanggalLahir: new Date("2006-03-18"),
      departemenId: departemen.id,
      programStudiId: prodi.id,
    },
  });

  const supervisorUser = await prisma.user.upsert({
    where: { email: "supervisor@ak007.test" },
    update: {},
    create: {
      name: "Lilik Maryuni",
      email: "supervisor@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: supervisorUser.id, roleId: supervisorRole.id } },
    update: {},
    create: { userId: supervisorUser.id, roleId: supervisorRole.id },
  });
  await prisma.pegawai.upsert({
    where: { userId: supervisorUser.id },
    update: {},
    create: {
      userId: supervisorUser.id,
      nip: "197808042001122001",
      jabatan: "Supervisor Akademik",
      noHp: "081298765432",
      departemenId: departemen.id,
      programStudiId: prodi.id,
    },
  });
  const manajerUser = await prisma.user.upsert({
    where: { email: "manajer@ak007.test" },
    update: {},
    create: {
      name: "Rina Manajer",
      email: "manajer@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: manajerUser.id, roleId: manajerRole.id } },
    update: {},
    create: { userId: manajerUser.id, roleId: manajerRole.id },
  });
  await prisma.pegawai.upsert({
    where: { userId: manajerUser.id },
    update: {},
    create: {
      userId: manajerUser.id,
      nip: "197812312001122002",
      jabatan: "Manajer TU",
      noHp: "081298765433",
      departemenId: departemen.id,
      programStudiId: prodi.id,
    },
  });
  const upaUser = await prisma.user.upsert({
    where: { email: "upa@ak007.test" },
    update: {},
    create: {
      name: "UPA Admin",
      email: "upa@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: upaUser.id, roleId: upaRole.id } },
    update: {},
    create: { userId: upaUser.id, roleId: upaRole.id },
  });
  await prisma.pegawai.upsert({
    where: { userId: upaUser.id },
    update: {},
    create: {
      userId: upaUser.id,
      nip: "198001012001122003",
      jabatan: "UPA",
      noHp: "081298765434",
      departemenId: departemen.id,
      programStudiId: prodi.id,
    },
  });
  const superadminUser = await prisma.user.upsert({
    where: { email: "superadmin@ak007.test" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@ak007.test",
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superadminUser.id, roleId: superadminRole.id } },
    update: {},
    create: { userId: superadminUser.id, roleId: superadminRole.id },
  });
  

  const credentialUsers = [
    mahasiswaUser,
    mahasiswaUser2,
    supervisorUser,
    manajerUser,
    upaUser,
    superadminUser,
  ];
  for (const user of credentialUsers) {
    await ensureCredentialAccount(user.id, user.email, DEFAULT_PASSWORD);
  }

  // Letter Type & Template AK007
  const existingLetterType = await prisma.letterType.findFirst({
    where: { name: "AK007" },
  });
  const ak007Type =
    existingLetterType ??
    (await prisma.letterType.create({
      data: { name: "AK007", description: "Surat Keterangan Mahasiswa" },
    }));

  const templateSchema = {
    title: "Surat Keterangan Mahasiswa",
    fields: [
      "nama",
      "nim",
      "programStudi",
      "birthPlace",
      "birthDate",
      "alamat",
      "semester",
      "keperluan",
      "tahunMulai",
      "tahunSelesai",
    ],
  };

  const existingTemplate = await prisma.letterTemplate.findFirst({
    where: { letterTypeId: ak007Type.id, versionName: "v1" },
  });
  const ak007Template =
    existingTemplate ??
    (await prisma.letterTemplate.create({
      data: {
        versionName: "v1",
        schemaDefinition: templateSchema,
        formFields: templateSchema,
        letterTypeId: ak007Type.id,
      },
    }));

  // Letter Instances (dummy)
  const instancesData = [
    {
      createdById: mahasiswaUser.id,
      status: Status.PENDING,
      values: {
        nama: "Ahmad Douglas",
        nim: "24060121130063",
        programStudi: "S1 - Informatika",
        birthPlace: "Blora",
        birthDate: "2006-03-18",
        alamat: "Semarang, Jl. XYZ",
        semester: "4 (Empat)",
        keperluan: "Sebagai syarat administrasi untuk pencairan tunjangan orang tua.",
        tahunMulai: "2024",
        tahunSelesai: "2025",
      },
    },
    {
      createdById: mahasiswaUser.id,
      status: Status.IN_PROGRESS,
      values: {
        nama: "Ahmad Douglas",
        nim: "24060121130063",
        programStudi: "S1 - Informatika",
        birthPlace: "Blora",
        birthDate: "2006-03-18",
        alamat: "Semarang, Jl. XYZ",
        semester: "4 (Empat)",
        keperluan: "Permohonan verifikasi status mahasiswa.",
        tahunMulai: "2024",
        tahunSelesai: "2025",
      },
    },
    {
      createdById: mahasiswaUser.id,
      status: Status.COMPLETED,
      values: {
        nama: "Ahmad Douglas",
        nim: "24060121130063",
        programStudi: "S1 - Informatika",
        birthPlace: "Blora",
        birthDate: "2006-03-18",
        alamat: "Semarang, Jl. XYZ",
        semester: "4 (Empat)",
        keperluan: "Sebagai lampiran beasiswa.",
        tahunMulai: "2024",
        tahunSelesai: "2025",
      },
    },
  ];

  for (const data of instancesData) {
    await prisma.letterInstance.create({
      data: {
        letterTypeId: ak007Type.id,
        createdById: data.createdById,
        status: data.status as any,
        schema: templateSchema,
        values: data.values,
      },
    });
  }

  console.log("Seeding dummy AK007 selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
