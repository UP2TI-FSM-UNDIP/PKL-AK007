"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterType = { id: string; name: string };
type TemplateApi = {
  id: string;
  versionName: string;
  schemaDefinition: unknown;
  formFields: unknown;
  letterTypeId: string;
  LetterType?: { name?: string } | null;
};

type BlockType = "text" | "field" | "signature";
type TemplateBlock = {
  id: string;
  type: BlockType;
  value?: string;
  label?: string;
  key?: string;
  lines?: string[];
  name?: string;
  nip?: string;
  location?: string;
};

const FIELD_OPTIONS = [
  { label: "Nama", value: "nama" },
  { label: "NIM", value: "nim" },
  { label: "Program Studi", value: "programStudi" },
  { label: "Tempat Lahir", value: "birthPlace" },
  { label: "Tanggal Lahir", value: "birthDate" },
  { label: "Alamat", value: "alamat" },
  { label: "Semester", value: "semester" },
  { label: "Keperluan", value: "keperluan" },
  { label: "Tahun Mulai", value: "tahunMulai" },
  { label: "Tahun Selesai", value: "tahunSelesai" },
  { label: "Nomor Surat", value: "nomorSurat" },
  { label: "Tahun Masuk", value: "tahunMasuk" },
  { label: "Sumber", value: "sumber" },
];

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const fieldLabelMap: Record<string, string> = {
  nama: "Nama",
  nim: "NIM",
  programStudi: "Program Studi",
  birthPlace: "Tempat Lahir",
  birthDate: "Tanggal Lahir",
  alamat: "Alamat",
  semester: "Semester",
  keperluan: "Keperluan",
  tahunMulai: "Tahun Mulai",
  tahunSelesai: "Tahun Selesai",
  nomorSurat: "Nomor Surat",
  tahunMasuk: "Tahun Masuk",
  sumber: "Sumber",
};

const buildAk007LegacyBlocks = (title?: string, fields?: string[]) => {
  const blocks: TemplateBlock[] = [
    { id: createId(), type: "text", value: title || "SURAT KETERANGAN MAHASISWA" },
    { id: createId(), type: "text", value: "Nomor : ............................" },
    {
      id: createId(),
      type: "text",
      value:
        "Dekan Fakultas Sains dan Matematika Universitas Diponegoro menerangkan bahwa:",
    },
  ];

  const orderedFields = fields?.length
    ? fields
    : ["nama", "birthPlace", "birthDate", "alamat", "programStudi", "nim", "semester", "keperluan"];

  orderedFields.forEach((field) => {
    blocks.push({
      id: createId(),
      type: "field",
      label: fieldLabelMap[field] ?? toTitleCase(field),
      key: field,
    });
  });

  blocks.push(
    {
      id: createId(),
      type: "text",
      value:
        "pada tahun akademik ........../.......... terdaftar sebagai mahasiswa Fakultas Sains dan Matematika (FSM) Universitas Diponegoro.",
    },
    {
      id: createId(),
      type: "signature",
      location: "Semarang, ……………………20….",
      lines: ["a.n. Dekan,", "Wakil Dekan I,", "u.b. Manager Bagian Tata Usaha,"],
      name: "Lilik Maryuni, S.E., M.Si.",
      nip: "197808042001122001",
    }
  );

  return blocks;
};

const normalizeBlocks = (schemaDefinition: unknown): TemplateBlock[] => {
  if (Array.isArray(schemaDefinition)) {
    return schemaDefinition.map((block) => ({
      id: createId(),
      ...(block as TemplateBlock),
    }));
  }

  if (
    schemaDefinition &&
    typeof schemaDefinition === "object" &&
    Array.isArray((schemaDefinition as { blocks?: unknown }).blocks)
  ) {
    return (schemaDefinition as { blocks: TemplateBlock[] }).blocks.map((block) => ({
      id: createId(),
      ...block,
    }));
  }

  const title = (schemaDefinition as { title?: string } | null)?.title;
  const fields = (schemaDefinition as { fields?: string[] } | null)?.fields ?? [];
  if (title?.toLowerCase().includes("surat keterangan mahasiswa")) {
    return buildAk007LegacyBlocks(title, fields);
  }

  const blocks: TemplateBlock[] = [];
  if (title) {
    blocks.push({ id: createId(), type: "text", value: title });
  }
  fields.forEach((field) => {
    blocks.push({
      id: createId(),
      type: "field",
      label: fieldLabelMap[field] ?? toTitleCase(field),
      key: field,
    });
  });
  return blocks;
};

const defaultBlocks = (): TemplateBlock[] => [
  { id: createId(), type: "text", value: "SURAT KETERANGAN MAHASISWA" },
  { id: createId(), type: "text", value: "Nomor : ............................" },
  {
    id: createId(),
    type: "text",
    value: "Dekan Fakultas Sains dan Matematika Universitas Diponegoro menerangkan bahwa:",
  },
  { id: createId(), type: "field", label: "Nama", key: "nama" },
  { id: createId(), type: "field", label: "Tempat / Tanggal Lahir", key: "birthDate" },
  { id: createId(), type: "field", label: "Alamat", key: "alamat" },
];

export default function TemplateSuratEditorPage() {
  const router = useRouter();
  const params = useParams<{ templateId: string }>();
  const templateId = params?.templateId ?? "";
  const isNew = templateId === "baru";

  const [categories, setCategories] = useState<LetterType[]>([]);
  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const [titleValue, setTitleValue] = useState("");
  const [titleBlockId, setTitleBlockId] = useState<string | null>(null);
  const [form, setForm] = useState({
    versionName: "v1",
    letterTypeId: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetch(`${API_BASE}/master/suratType/all`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as LetterType[];
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadTemplate = async () => {
      if (isNew) {
        const defaults = defaultBlocks();
        const firstText = defaults.find((block) => block.type === "text");
        setBlocks(defaults);
        setTitleValue(firstText?.value ?? "");
        setTitleBlockId(firstText?.id ?? null);
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/master/suratTemplate/${templateId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const defaults = defaultBlocks();
          const firstText = defaults.find((block) => block.type === "text");
          setBlocks(defaults);
          setTitleValue(firstText?.value ?? "");
          setTitleBlockId(firstText?.id ?? null);
          return;
        }
        const data = (await response.json()) as TemplateApi;
        setForm({
          versionName: data.versionName,
          letterTypeId: data.letterTypeId,
        });
        const normalized = normalizeBlocks(data.schemaDefinition ?? data.formFields ?? []);
        const firstText = normalized.find((block) => block.type === "text");
        setBlocks(normalized);
        setTitleValue(firstText?.value ?? "");
        setTitleBlockId(firstText?.id ?? null);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplate();
  }, [isNew, templateId]);

  const hasSignature = useMemo(
    () => blocks.some((block) => block.type === "signature"),
    [blocks]
  );

  const selectedCategoryLabel = useMemo(
    () => categories.find((item) => item.id === form.letterTypeId)?.name ?? "-",
    [categories, form.letterTypeId]
  );

  const updateBlock = (id: string, updater: (block: TemplateBlock) => TemplateBlock) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? updater(block) : block)));
  };

  const ensureTitleBlock = (value: string) => {
    if (titleBlockId) {
      updateBlock(titleBlockId, (prev) => ({ ...prev, value }));
      return;
    }
    const newBlock: TemplateBlock = { id: createId(), type: "text", value };
    setBlocks((prev) => [newBlock, ...prev]);
    setTitleBlockId(newBlock.id);
  };

  const addBlock = (type: BlockType) => {
    if (type === "signature" && hasSignature) {
      alert("Tanda tangan maksimal hanya 1 blok.");
      return;
    }
    if (type === "signature") {
      setBlocks((prev) => [
        ...prev,
        {
          id: createId(),
          type: "signature",
          location: "Semarang, ……………………20….",
          lines: ["a.n. Dekan,", "Wakil Dekan I,", "u.b. Manager Bagian Tata Usaha,"],
          name: "Lilik Maryuni, S.E., M.Si.",
          nip: "197808042001122001",
        },
      ]);
      return;
    }
    if (type === "field") {
      setBlocks((prev) => [
        ...prev,
        { id: createId(), type: "field", label: "Nama", key: "nama" },
      ]);
      return;
    }
    setBlocks((prev) => [...prev, { id: createId(), type: "text", value: "" }]);
  };

  const removeBlock = (id: string) => {
    if (id === titleBlockId) {
      alert("Judul surat tidak bisa dihapus.");
      return;
    }
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    if (id === titleBlockId) {
      return;
    }
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index < 0) return prev;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(nextIndex, 0, moved);
      return updated;
    });
  };

  const changeBlockType = (id: string, nextType: BlockType) => {
    const current = blocks.find((block) => block.id === id);
    if (nextType === "signature" && hasSignature && current?.type !== "signature") {
      alert("Tanda tangan maksimal hanya 1 blok.");
      return;
    }
    if (id === titleBlockId && nextType !== "text") {
      alert("Judul surat harus berupa teks.");
      return;
    }
    updateBlock(id, (block) => {
      if (nextType === "text") {
        return { id: block.id, type: "text", value: block.value ?? "" };
      }
      if (nextType === "field") {
        return { id: block.id, type: "field", label: block.label ?? "Nama", key: block.key ?? "nama" };
      }
      return {
        id: block.id,
        type: "signature",
        location: block.location ?? "Semarang, ……………………20….",
        lines: block.lines?.length ? block.lines : ["a.n. Dekan,", "Wakil Dekan I,", "u.b. Manager Bagian Tata Usaha,"],
        name: block.name ?? "Lilik Maryuni, S.E., M.Si.",
        nip: block.nip ?? "197808042001122001",
      };
    });
  };

  const handleSave = async () => {
    if (!form.versionName.trim() || !form.letterTypeId) {
      alert("Versi dan kategori wajib diisi.");
      return;
    }
    if (!titleValue.trim()) {
      alert("Judul surat wajib diisi.");
      return;
    }
    ensureTitleBlock(titleValue);
    const payload = {
      versionName: form.versionName,
      letterTypeId: form.letterTypeId,
      schemaDefinition: blocks.map(({ id, ...block }) => block),
      formFields: blocks.map(({ id, ...block }) => block),
    };
    const response = await fetch(
      `${API_BASE}/master/suratTemplate${isNew ? "" : `/${templateId}`}`,
      {
        method: isNew ? "POST" : "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      alert("Gagal menyimpan template.");
      return;
    }
    alert("Template berhasil disimpan.");
    router.push("/superadmin/template-surat");
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <button
          onClick={() => router.push("/superadmin/template-surat")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
        <span>/</span>
        <span className="text-gray-700 font-medium">Edit Template Surat</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Tambah Template Surat" : "Edit Template Surat"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ubah metadata, susun baris teks atau field, lalu lihat pratinjau di sisi kanan.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          Simpan Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1.5fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                placeholder="Judul Surat"
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value);
                  ensureTitleBlock(e.target.value);
                }}
              />
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nama Versi"
                value={form.versionName}
                onChange={(e) => setForm((prev) => ({ ...prev, versionName: e.target.value }))}
              />
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.letterTypeId}
                onChange={(e) => setForm((prev) => ({ ...prev, letterTypeId: e.target.value }))}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => addBlock("text")}
              >
                <Plus className="w-3 h-3" />
                Tambah Teks
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => addBlock("field")}
              >
                <Plus className="w-3 h-3" />
                Tambah Field
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => addBlock("signature")}
                disabled={hasSignature}
              >
                <Plus className="w-3 h-3" />
                Tambah Tanda Tangan
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="text-sm text-gray-500">Memuat template...</div>
              ) : blocks.length === 0 ? (
                <div className="text-sm text-gray-500">Belum ada baris template.</div>
              ) : (
                blocks
                  .filter((block) => block.id !== titleBlockId)
                  .map((block, index) => (
                  <div key={block.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <select
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                          value={block.type}
                          onChange={(e) => changeBlockType(block.id, e.target.value as BlockType)}
                        >
                          <option value="text">Teks</option>
                          <option value="field">Field</option>
                          <option value="signature">Tanda tangan</option>
                        </select>
                        <span className="text-xs text-gray-400">#{index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <button
                          type="button"
                          className="hover:text-gray-600"
                          onClick={() => moveBlock(block.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-gray-600"
                          onClick={() => moveBlock(block.id, "down")}
                          disabled={index === blocks.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {block.type === "text" ? (
                      <textarea
                        className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Isi teks surat..."
                        value={block.value ?? ""}
                        onChange={(e) =>
                          updateBlock(block.id, (prev) => ({ ...prev, value: e.target.value }))
                        }
                      />
                    ) : null}

                    {block.type === "field" ? (
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Label (contoh: Nama)"
                          value={block.label ?? ""}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, label: e.target.value }))
                          }
                        />
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          value={block.key ?? "nama"}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, key: e.target.value }))
                          }
                        >
                          {FIELD_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}

                    {block.type === "signature" ? (
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Lokasi dan tanggal (contoh: Semarang, ………20….)"
                          value={block.location ?? ""}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, location: e.target.value }))
                          }
                        />
                        <textarea
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Baris jabatan (pisahkan dengan enter)"
                          value={(block.lines ?? []).join("\n")}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({
                              ...prev,
                              lines: e.target.value.split("\n").filter(Boolean),
                            }))
                          }
                        />
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <input
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Nama penanda tangan"
                            value={block.name ?? ""}
                            onChange={(e) =>
                              updateBlock(block.id, (prev) => ({ ...prev, name: e.target.value }))
                            }
                          />
                          <input
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="NIP"
                            value={block.nip ?? ""}
                            onChange={(e) =>
                              updateBlock(block.id, (prev) => ({ ...prev, nip: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pratinjau Surat</h3>
              <p className="text-xs text-gray-500">Kategori {selectedCategoryLabel}</p>
            </div>
            <span className="text-xs text-gray-400">100%</span>
          </div>
          <div className="h-[calc(100%-64px)] overflow-auto bg-slate-50 p-6">
            <div className="mx-auto w-full max-w-[720px] bg-white shadow">
              <div
                className="w-full bg-[#ffffff] text-black"
                style={{
                  minHeight: "297mm",
                  padding: "14mm 25mm 25mm",
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                <header className="pb-2 -mx-[20mm]">
                  <img src="/persuratan-keterangan-mhs/kopSurat.png" alt="Kop Surat FSM Undip" className="w-[calc(100%+40mm)]" />
                </header>

                <div className="mt-6 space-y-3 text-[12pt] leading-[1.85]">
                  {blocks.map((block) => {
                    if (block.type === "text") {
                      return (
                        <p key={block.id} className="text-left">
                          {block.value?.trim() ? block.value : "……"}
                        </p>
                      );
                    }
                    if (block.type === "field") {
                      return (
                        <div key={block.id} className="flex">
                          <div className="w-56">{block.label || "Label"}</div>
                          <div className="w-4 text-left">:</div>
                          <div className="flex-1 border-b border-dotted border-black" />
                        </div>
                      );
                    }
                    return (
                      <div key={block.id} className="pt-6">
                        <div>{block.location || "Semarang, ……………………20…."}</div>
                        <div className="mt-2 space-y-1">
                          {(block.lines ?? []).map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                        <div className="mt-6 h-32" />
                        <div className="mt-2 font-bold underline underline-offset-4">
                          {block.name || "Nama Penanda Tangan"}
                        </div>
                        <div className="mt-1">NIP. {block.nip || ".........................."}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
