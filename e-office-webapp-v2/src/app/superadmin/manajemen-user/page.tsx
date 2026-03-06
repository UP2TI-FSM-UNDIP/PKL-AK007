"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, Edit, CheckCircle, XCircle } from "lucide-react";
import { UserActionModal } from "@/components/superadmin/UserActionModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 10;

type ApiUser = {
  id: string;
  name: string;
  email: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  mahasiswa?: {
    nim?: string | null;
  } | null;
  pegawai?: {
    nip?: string | null;
  } | null;
  userRole?: { role?: { name?: string } | null }[];
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  nip?: string;
  nim?: string;
  lastActive?: string;
};

type Departemen = { id: string; name: string };
type ProgramStudi = {
  id: string;
  name: string;
  departemenId?: string | null;
  departemen?: { id: string; name: string } | null;
};

const ROLE_OPTIONS = [
  { label: "Semua", value: "" },
  { label: "Mahasiswa", value: "mahasiswa" },
  { label: "Supervisor Akademik", value: "supervisor_akademik" },
  { label: "Manajer TU", value: "manager_tu" },
  { label: "UPA", value: "upa" },
  { label: "Superadmin", value: "superadmin" },
];

const prettyRole = (role?: string) =>
  role ? role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "-";

const formatLastActive = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ManajemenUserPage() {
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [query, setQuery] = useState({ search: "", role: "" });
  const [departemen, setDepartemen] = useState<Departemen[]>([]);
  const [programStudi, setProgramStudi] = useState<ProgramStudi[]>([]);
  const [emailCheck, setEmailCheck] = useState<{
    status: "idle" | "checking" | "available" | "unavailable" | "invalid";
    message: string;
  }>({ status: "idle", message: "" });
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "",
    nim: "",
    tahunMasuk: "",
    noHp: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    departemenId: "",
    programStudiId: "",
    nip: "",
    jabatan: "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [departemenRes, prodiRes] = await Promise.all([
          fetch(`${API_BASE}/master/departemen/all`, { credentials: "include" }),
          fetch(`${API_BASE}/master/program-studi/all`, { credentials: "include" }),
        ]);
        if (departemenRes.ok) {
          const data = (await departemenRes.json()) as Departemen[];
          setDepartemen(data);
        }
        if (prodiRes.ok) {
          const data = (await prodiRes.json()) as ProgramStudi[];
          setProgramStudi(data);
        }
      } catch (error) {
        console.warn("Failed to load departemen/prodi", error);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("take", String(PAGE_SIZE));
        if (query.search) params.set("search", query.search);
        if (query.role) params.set("role", query.role);
        const response = await fetch(`${API_BASE}/master/user/all?${params.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setUsers([]);
          setTotal(0);
          return;
        }
        const data = (await response.json()) as { items: ApiUser[]; total: number } | ApiUser[];
        const items = Array.isArray(data) ? data : data.items;
        const totalItems = Array.isArray(data) ? data.length : data.total;
        const mapped = items.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: prettyRole(user.userRole?.[0]?.role?.name),
          status: user.deletedAt ? "Inactive" : "Active",
          nip: user.pegawai?.nip ?? undefined,
          nim: user.mahasiswa?.nim ?? undefined,
          lastActive: formatLastActive(user.updatedAt),
        }));
        setUsers(mapped);
        setTotal(totalItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [page, query]);

  useEffect(() => {
    const emailInput = createForm.email.trim();
    if (!emailInput) {
      setEmailCheck({ status: "idle", message: "" });
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(emailInput)) {
      setEmailCheck({ status: "invalid", message: "Format email tidak valid." });
      return;
    }

    setEmailCheck({ status: "checking", message: "Memeriksa email..." });
    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_BASE}/master/user/check-email?email=${encodeURIComponent(emailInput)}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          setEmailCheck({ status: "invalid", message: "Gagal memeriksa email." });
          return;
        }
        const result = (await response.json()) as { available?: boolean };
        if (result.available) {
          setEmailCheck({ status: "available", message: "Email tersedia." });
        } else {
          setEmailCheck({ status: "unavailable", message: "Email sudah digunakan." });
        }
      } catch (error) {
        setEmailCheck({ status: "invalid", message: "Gagal memeriksa email." });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [createForm.email]);

  const filteredDepartemen = useMemo(() => {
    const filtered = departemen.filter(
      (item) =>
        !/fakultas sains dan matematika/i.test(item.name) &&
        !/\bfsm\b/i.test(item.name.trim())
    );
    return filtered.length ? filtered : departemen;
  }, [departemen]);

  const filteredProgramStudi = useMemo(() => {
    const sanitized = programStudi.filter((item) => !/\bfsm\b/i.test(item.name.trim()));
    if (!createForm.departemenId) return [];
    const filtered = sanitized.filter((item) => {
      const departemenId = item.departemenId ?? item.departemen?.id ?? "";
      return departemenId === createForm.departemenId;
    });
    return filtered.length ? filtered : sanitized;
  }, [createForm.departemenId, programStudi]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let withoutPrefix = digits.startsWith("62") ? digits.slice(2) : digits;
    if (withoutPrefix.length && withoutPrefix[0] !== "8") {
      withoutPrefix = `8${withoutPrefix.slice(1)}`;
    }
    const limited = withoutPrefix.slice(0, 12);
    setCreateForm((prev) => ({ ...prev, noHp: `+62${limited}` }));
  };

  const handleEditClick = (user: UserRow) => {
    setSelectedUser(user);
    setShowActionModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowActionModal(false);
    setSelectedUser(null);
    document.body.style.overflow = "unset";
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    const response = await fetch(`${API_BASE}/master/user/${selectedUser.id}/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      alert("Gagal reset password.");
      return;
    }
    const data = (await response.json()) as { password?: string };
    alert(`Password baru untuk ${selectedUser.email}: ${data.password ?? "password123"}`);
    handleCloseModal();
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const endpoint =
      selectedUser.status === "Active" ? "deactivate" : "activate";
    const response = await fetch(`${API_BASE}/master/user/${selectedUser.id}/${endpoint}`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      alert("Gagal memperbarui status akun.");
      return;
    }
    alert(
      selectedUser.status === "Active"
        ? `Akun ${selectedUser.name} dinonaktifkan.`
        : `Akun ${selectedUser.name} diaktifkan.`
    );
    handleCloseModal();
    setPage(1);
    setQuery((prev) => ({ ...prev }));
  };

  const handleCreateUser = async () => {
    if (!createForm.roleName) {
      alert("Pilih role terlebih dahulu.");
      return;
    }
    if (!createForm.name.trim() || !createForm.email.trim()) {
      alert("Nama dan email wajib diisi.");
      return;
    }
    if (emailCheck.status === "unavailable") {
      alert("Email sudah digunakan.");
      return;
    }
    if (emailCheck.status === "checking") {
      alert("Sedang memeriksa email. Tunggu sebentar.");
      return;
    }
    if (emailCheck.status === "invalid") {
      alert("Periksa kembali format email.");
      return;
    }
    if (createForm.roleName === "mahasiswa") {
      if (
        !createForm.nim ||
        !createForm.tahunMasuk ||
        !createForm.noHp ||
        !createForm.alamat ||
        !createForm.tempatLahir ||
        !createForm.tanggalLahir ||
        !createForm.departemenId ||
        !createForm.programStudiId
      ) {
        alert("Lengkapi data mahasiswa terlebih dahulu.");
        return;
      }
      if (!/^\d{14}$/.test(createForm.nim)) {
        alert("NIM harus 14 digit angka.");
        return;
      }
      const currentYear = new Date().getFullYear();
      if (!/^\d{4}$/.test(createForm.tahunMasuk) || Number(createForm.tahunMasuk) > currentYear) {
        alert(`Tahun masuk harus 4 digit dan tidak lebih dari ${currentYear}.`);
        return;
      }
      if (!/^\+62\d{9,12}$/.test(createForm.noHp)) {
        alert("No HP harus diawali +62 dan diikuti 9-12 digit angka.");
        return;
      }
    } else if (!createForm.nip || !createForm.jabatan || !createForm.noHp) {
      alert("Lengkapi data pegawai terlebih dahulu.");
      return;
    } else {
      if (!/^\d{18}$/.test(createForm.nip)) {
        alert("NIP harus 18 digit angka.");
        return;
      }
      if (!/^\+62\d{9,12}$/.test(createForm.noHp)) {
        alert("No HP harus diawali +62 dan diikuti 9-12 digit angka.");
        return;
      }
    }
    const payload =
      createForm.roleName === "mahasiswa"
        ? {
            ...createForm,
          }
        : {
            name: createForm.name,
            email: createForm.email,
            password: createForm.password,
            roleName: createForm.roleName,
            nip: createForm.nip,
            jabatan: createForm.jabatan,
            noHp: createForm.noHp,
          };

    const response = await fetch(`${API_BASE}/master/user`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const fallback = "Gagal membuat user. Periksa input.";
      try {
        const data = (await response.json()) as { error?: string };
        if (data?.error === "Nomor HP must start with +62, first digit 8, total 9-12 digits") {
          alert("No HP harus diawali +628 dan diikuti 9-12 digit angka.");
          return;
        }
        if (data?.error === "Pegawai data is incomplete") {
          alert("Lengkapi data pegawai terlebih dahulu.");
          return;
        }
        if (data?.error === "NIP must be 18 digits") {
          alert("NIP harus 18 digit angka.");
          return;
        }
        alert(data?.error || fallback);
      } catch (error) {
        alert(fallback);
      }
      return;
    }
    alert("User berhasil dibuat.");
    setShowCreateModal(false);
    setCreateForm({
      name: "",
      email: "",
      password: "",
      roleName: "",
      nim: "",
      tahunMasuk: "",
      noHp: "",
      alamat: "",
      tempatLahir: "",
      tanggalLahir: "",
      departemenId: "",
      programStudiId: "",
      nip: "",
      jabatan: "",
    });
    setEmailCheck({ status: "idle", message: "" });
    setPage(1);
    setQuery((prev) => ({ ...prev }));
  };

  const totalLabel = useMemo(() => {
    if (isLoading) return "Loading...";
    if (total === 0) return "Showing 0 of 0";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Showing ${start} to ${end} of ${total}`;
  }, [isLoading, page, total]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div
        className={`p-6 space-y-6 bg-gray-50 min-h-screen transition-all duration-300 ${
          showActionModal || showCreateModal ? "blur-[2px] brightness-95" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard / Manajemen User</h1>
            <p className="text-sm text-gray-500 mt-1">
              Daftar semua pengguna dengan opsi untuk menambah, mengedit, dan mengelola status akun
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            onClick={() => setShowCreateModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={roleInput}
            onChange={(event) => setRoleInput(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm text-gray-700"
            onClick={() => {
              setPage(1);
              setQuery({ search: searchInput.trim(), role: roleInput });
            }}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Nama & NIP</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Terakhir Aktif</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Aksi</div>
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-6 text-sm text-gray-500">Memuat data user...</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">Belum ada user.</div>
            ) : users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition">
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.nip ?? user.nim ?? "-"}</div>
                  </div>
                  <div className="col-span-3">
                    <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-700">{user.role}</span>
                  </div>
                  <div className="col-span-2 text-xs text-gray-600">{user.lastActive ?? "-"}</div>
                  <div className="col-span-1">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="md:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.nip ?? user.nim ?? "-"}</div>
                    </div>
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-xs">
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">{user.role}</span>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">Terakhir aktif: {user.lastActive ?? "-"}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-600">{totalLabel}</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserActionModal
        isOpen={showActionModal}
        selectedUser={selectedUser}
        onClose={handleCloseModal}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
      />

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tambah User</h2>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                Tutup
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                value={createForm.roleName}
                onChange={(event) => {
                  const roleName = event.target.value;
                  setCreateForm((prev) => ({
                    ...prev,
                    roleName,
                    nim: "",
                    tahunMasuk: "",
                    noHp: roleName ? "+62" : "",
                    alamat: "",
                    tempatLahir: "",
                    tanggalLahir: "",
                    departemenId: "",
                    programStudiId: "",
                    nip: "",
                    jabatan: "",
                  }));
                  setEmailCheck({ status: "idle", message: "" });
                }}
              >
                <option value="" disabled>
                  Pilih Role
                </option>
                {ROLE_OPTIONS.filter((role) => role.value).map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nama"
                value={createForm.name}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <div className="w-full space-y-1">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Email (tanpa domain)"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                />
                {emailCheck.message ? (
                  <p
                    className={`text-xs ${
                      emailCheck.status === "available"
                        ? "text-green-600"
                        : emailCheck.status === "checking"
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {emailCheck.message}
                  </p>
                ) : null}
              </div>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Password (opsional)"
                value={createForm.password}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
              />
              {createForm.roleName === "mahasiswa" ? (
                <>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="NIM (14 digit)"
                    value={createForm.nim}
                    inputMode="numeric"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 14);
                      setCreateForm((prev) => ({ ...prev, nim: digits }));
                    }}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Tahun Masuk (YYYY)"
                    value={createForm.tahunMasuk}
                    inputMode="numeric"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                      const currentYear = new Date().getFullYear();
                      const parsed = Number(digits || 0);
                      const limited = parsed > currentYear ? String(currentYear) : digits;
                      setCreateForm((prev) => ({ ...prev, tahunMasuk: limited }));
                    }}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="+62xxxxxxxxx"
                    value={createForm.noHp || "+62"}
                    inputMode="numeric"
                    onFocus={() => {
                      if (!createForm.noHp) {
                        setCreateForm((prev) => ({ ...prev, noHp: "+62" }));
                      }
                    }}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Alamat"
                    value={createForm.alamat}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, alamat: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Tempat Lahir"
                    value={createForm.tempatLahir}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, tempatLahir: event.target.value }))}
                  />
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={createForm.tanggalLahir}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, tanggalLahir: event.target.value }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={createForm.departemenId}
                    onChange={(event) => {
                      const departemenId = event.target.value;
                      setCreateForm((prev) => ({
                        ...prev,
                        departemenId,
                        programStudiId: programStudi.some((item) => {
                          const itemDepartemenId = item.departemenId ?? item.departemen?.id ?? "";
                          return item.id === prev.programStudiId && itemDepartemenId === departemenId;
                        })
                          ? prev.programStudiId
                          : "",
                      }));
                    }}
                  >
                    <option value="" disabled>
                      Pilih Departemen
                    </option>
                    {filteredDepartemen.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                    value={createForm.programStudiId}
                    disabled={!createForm.departemenId}
                    onChange={(event) => {
                      const programStudiId = event.target.value;
                      const selected = programStudi.find((item) => item.id === programStudiId);
                      const departemenId = selected?.departemenId ?? selected?.departemen?.id ?? "";
                      setCreateForm((prev) => ({
                        ...prev,
                        programStudiId,
                        departemenId: departemenId || prev.departemenId,
                      }));
                    }}
                  >
                    <option value="" disabled>
                      Pilih Program Studi
                    </option>
                    {filteredProgramStudi.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </>
              ) : createForm.roleName ? (
                <>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="NIP (18 digit)"
                    value={createForm.nip}
                    inputMode="numeric"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 18);
                      setCreateForm((prev) => ({ ...prev, nip: digits }));
                    }}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Jabatan"
                    value={createForm.jabatan}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, jabatan: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="+62xxxxxxxxx"
                    value={createForm.noHp || "+62"}
                    inputMode="numeric"
                    onFocus={() => {
                      if (!createForm.noHp) {
                        setCreateForm((prev) => ({ ...prev, noHp: "+62" }));
                      }
                    }}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                  />
                </>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                onClick={() => setShowCreateModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!createForm.roleName}
                onClick={handleCreateUser}
              >
                Simpan User
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
