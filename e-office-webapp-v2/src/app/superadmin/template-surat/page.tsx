"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText, Search, Plus, Edit, Eye, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 10;

type LetterType = { id: string; name: string };
type TemplateApi = {
  id: string;
  versionName: string;
  schemaDefinition: unknown;
  formFields: unknown;
  letterTypeId: string;
  LetterType?: { name?: string } | null;
};

export default function TemplateSuratPage() {
  const [selectedKategori, setSelectedKategori] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<TemplateApi[]>([]);
  const [categories, setCategories] = useState<LetterType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("take", String(PAGE_SIZE));
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedKategori) params.set("category", selectedKategori);
        const response = await fetch(`${API_BASE}/master/suratTemplate/all?${params.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setTemplates([]);
          setTotal(0);
          return;
        }
        const data = (await response.json()) as { items: TemplateApi[]; total: number } | TemplateApi[];
        const items = Array.isArray(data) ? data : data.items;
        const totalItems = Array.isArray(data) ? data.length : data.total;
        setTemplates(items);
        setTotal(totalItems);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, [page, searchQuery, selectedKategori]);

  const openCreate = () => {
    router.push("/superadmin/template-surat/baru");
  };

  const openEdit = (template: TemplateApi) => {
    router.push(`/superadmin/template-surat/${template.id}`);
  };

  const totalLabel = useMemo(() => {
    if (isLoading) return "Memuat template...";
    if (total === 0) return "Menampilkan 0 template";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Menampilkan ${start} - ${end} dari ${total} template`;
  }, [isLoading, page, total]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Superadmin</span>
        <span>/</span>
        <span className="text-gray-700 font-medium">Template Surat</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Surat</h1>
          <p className="text-sm text-gray-500 mt-2">
            Kelola berbagai template surat. Anda bisa membuat template baru dan mengedit yang sudah ada.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Kategori</span>
            </div>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kategori</option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Template</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {total} templates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                      Memuat template...
                    </td>
                  </tr>
                ) : templates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                      Belum ada template.
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{template.versionName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{template.LetterType?.name ?? "-"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{template.versionName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => openEdit(template)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            onClick={() => openEdit(template)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{totalLabel}</p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm rounded-md">{page}</button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
