"use client";

import { useState, useRef, ChangeEvent } from "react";
import { ChevronDown, Eye, FileText, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";

// UI Components - You need to import these from your actual paths
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { FormStepper } from "@/components/FormStepper";

const steps = [
  { label: "Info Pengajuan" },
  { label: "Detail Pengajuan" },
  { label: "Lampiran" },
  { label: "Review & Ajukan" }
];

const breadcrumbItems = [
  { label: "Form Pengajuan Surat", href: "/mahasiswa/identitas-pemohon" },
  { label: "Lampiran" }
];

type Attachment = {
  id: string;
  name: string;
  size: string;
  fileSize: number;
  type: string;
  typeLabel: string;
  badgeColor: string;
  file?: File;
};

const initialMainAttachments: Attachment[] = [
  { 
    id: "1", 
    name: "KTM.pdf", 
    size: "2.1 MB", 
    fileSize: 2.1 * 1024 * 1024,
    type: "pdf",
    typeLabel: "KTM", 
    badgeColor: "bg-red-100 text-red-600" 
  },
  { 
    id: "2", 
    name: "Foto.jpg", 
    size: "850 KB", 
    fileSize: 850 * 1024,
    type: "image",
    typeLabel: "Foto", 
    badgeColor: "bg-blue-100 text-blue-600" 
  },
];

export default function LampiranPage() {
  const [mainAttachments, setMainAttachments] = useState<Attachment[]>(initialMainAttachments);
  const [additionalAttachments, setAdditionalAttachments] = useState<Attachment[]>([]);
  const [dragOverMain, setDragOverMain] = useState(false);
  const [dragOverAdditional, setDragOverAdditional] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File, isMain: boolean): { valid: boolean; message?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: 'Format file harus PDF, JPG, atau PNG' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, message: 'Ukuran file maksimal 5MB' };
    }

    return { valid: true };
  };

  const handleFileUpload = (files: FileList | null, isMain: boolean) => {
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    Array.from(files).forEach((file) => {
      const validation = validateFile(file, isMain);
      if (!validation.valid) {
        alert(validation.message || 'File tidak valid');
        return;
      }

      const fileType = file.type.includes('image') ? 'image' : 'pdf';
      const typeLabel = isMain ? (fileType === 'image' ? 'Foto' : 'KTM') : 'Dokumen';
      const badgeColor = fileType === 'image' 
        ? 'bg-blue-100 text-blue-600' 
        : 'bg-red-100 text-red-600';

      const newAttachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        fileSize: file.size,
        type: fileType,
        typeLabel,
        badgeColor,
        file
      };

      newAttachments.push(newAttachment);
    });

    if (isMain) {
      setMainAttachments(prev => [...prev, ...newAttachments]);
    } else {
      setAdditionalAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string, isMain: boolean) => {
    if (isMain) {
      setMainAttachments(prev => prev.filter(attachment => attachment.id !== id));
    } else {
      setAdditionalAttachments(prev => prev.filter(attachment => attachment.id !== id));
    }
  };

  const handleViewAttachment = (attachment: Attachment) => {
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      window.open(url, '_blank');
    } else {
      console.log('Viewing:', attachment.name);
      alert(`Melihat file: ${attachment.name}\n\nIni adalah contoh untuk file yang sudah ada di sistem.`);
    }
  };

  const handleDrop = (e: React.DragEvent, isMain: boolean) => {
    e.preventDefault();
    if (isMain) {
      setDragOverMain(false);
    } else {
      setDragOverAdditional(false);
    }
    handleFileUpload(e.dataTransfer.files, isMain);
  };

  const handleDragOver = (e: React.DragEvent, isMain: boolean) => {
    e.preventDefault();
    if (isMain) {
      setDragOverMain(true);
    } else {
      setDragOverAdditional(true);
    }
  };

  const handleDragLeave = (isMain: boolean) => {
    if (isMain) {
      setDragOverMain(false);
    } else {
      setDragOverAdditional(false);
    }
  };

  return (
	<div className="min-h-screen bg-[#F3F3F3]">
      <Navbar />
      
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
        <PageHeader
          title="Lampiran"
          description="Lampirkan dokumen pendukung yang diperlukan."
          breadcrumbItems={breadcrumbItems}
        />

        <FormStepper steps={steps} currentStep={3} />

        <AttachmentSection
          title="Lampiran Utama"
          requiredNote="Wajib. Unggah minimal 1 dokumen pendukung utama. Format: PDF, JPG, PNG. Maks: 5MB/file."
          attachments={mainAttachments}
          onFileUpload={(files) => handleFileUpload(files, true)}
          onRemoveAttachment={(id) => handleRemoveAttachment(id, true)}
          onViewAttachment={handleViewAttachment}
          isMain={true}
          dragOver={dragOverMain}
          onDrop={(e) => handleDrop(e, true)}
          onDragOver={(e) => handleDragOver(e, true)}
          onDragLeave={() => handleDragLeave(true)}
        />

        <AttachmentSection
          title="Lampiran Tambahan"
          requiredNote="Opsional. Tambahkan dokumen pendukung lainnya jika diperlukan."
          attachments={additionalAttachments}
          onFileUpload={(files) => handleFileUpload(files, false)}
          onRemoveAttachment={(id) => handleRemoveAttachment(id, false)}
          onViewAttachment={handleViewAttachment}
          isMain={false}
          dragOver={dragOverAdditional}
          onDrop={(e) => handleDrop(e, false)}
          onDragOver={(e) => handleDragOver(e, false)}
          onDragLeave={() => handleDragLeave(false)}
        />

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/mahasiswa/detail-pengajuan"
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Kembali
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-[#0A77C8] px-5 py-2 text-sm font-semibold text-[#0A77C8] transition hover:bg-[#0A77C8]/10"
              onClick={() => {
                const totalAttachments = mainAttachments.length + additionalAttachments.length;
                alert(`Draft disimpan dengan ${totalAttachments} lampiran`);
              }}
            >
              Simpan Draft
            </button>
            <Link
              href="/mahasiswa/review-ajukan"
              className="rounded-full bg-[#0A77C8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085ea0]"
              onClick={(e) => {
                if (mainAttachments.length === 0) {
                  e.preventDefault();
                  alert("Harap unggah minimal 1 lampiran utama");
                }
              }}
            >
              Lanjut
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

interface AttachmentSectionProps {
  title: string;
  requiredNote: string;
  attachments: Attachment[];
  onFileUpload: (files: FileList | null) => void;
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: Attachment) => void;
  isMain: boolean;
  dragOver: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

function AttachmentSection({
  title,
  requiredNote,
  attachments,
  onFileUpload,
  onRemoveAttachment,
  onViewAttachment,
  isMain,
  dragOver,
  onDrop,
  onDragOver,
  onDragLeave,
}: AttachmentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileUpload(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasItems = attachments.length > 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">
          {title}
          {title === "Lampiran Utama" && <span className="text-red-500">*</span>}
        </h2>
        <p className="text-sm text-gray-600">{requiredNote}</p>
      </div>

      <div
        className={`mt-4 rounded-xl border-2 border-dashed ${dragOver ? 'border-[#0A77C8] bg-[#0A77C8]/5' : 'border-gray-300'} bg-gray-50 px-6 py-8 text-center text-sm text-gray-600 transition-colors`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0A77C8]/10 text-[#0A77C8]">
          <UploadCloud size={22} />
        </div>
        <p className="mt-3 text-base font-semibold text-gray-800">
          Seret & lepas atau{" "}
          <button
            type="button"
            className="text-[#0A77C8] underline underline-offset-4"
            onClick={handleFileInputClick}
          >
            pilih file
          </button>
        </p>
        <p className="text-xs text-gray-500">untuk diunggah</p>
      </div>

      {hasItems && (
        <div className="mt-4 space-y-3">
          {attachments.map((item) => (
            <AttachmentRow 
              key={item.id} 
              attachment={item} 
              onRemove={() => onRemoveAttachment(item.id)}
              onView={() => onViewAttachment(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface AttachmentRowProps {
  attachment: Attachment;
  onRemove: () => void;
  onView: () => void;
}

function AttachmentRow({ attachment, onRemove, onView }: AttachmentRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${attachment.badgeColor}`}>
        <FileText size={18} />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <span className="font-semibold text-gray-900">{attachment.name}</span>
        <span className="text-xs text-gray-500">{attachment.size}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-800">
          <span>{attachment.typeLabel}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100"
          aria-label="Lihat lampiran"
          onClick={onView}
        >
          <Eye size={18} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
          aria-label="Hapus lampiran"
          onClick={onRemove}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
