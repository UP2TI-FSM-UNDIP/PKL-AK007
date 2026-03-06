"use client";

import React, { useEffect } from "react";
import { Key, UserX, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  nip?: string;
  nim?: string;
  email: string;
  status: "Active" | "Inactive";
  role: string;
}

interface UserActionModalProps {
  isOpen: boolean;
  selectedUser: User | null;
  onClose: () => void;
  onResetPassword: () => void;
  onToggleStatus: () => void;
}

export const UserActionModal = ({
  isOpen,
  selectedUser,
  onClose,
  onResetPassword,
  onToggleStatus,
}: UserActionModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200 pointer-events-auto relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Kelola Akun</h3>
          <div className="mt-3">
            <p className="text-base font-medium text-gray-900">{selectedUser.name}</p>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span className="text-gray-600">{selectedUser.nip ?? selectedUser.nim ?? "-"}</span>
              <span className="text-gray-300">-</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedUser.role}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{selectedUser.email}</p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          <button
            onClick={onResetPassword}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Reset Password</p>
                <p className="text-xs text-gray-500">Kirim link reset password ke email user</p>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-medium">&gt;</span>
          </button>

          <button
            onClick={onToggleStatus}
            className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-all group ${
              selectedUser.status === "Active"
                ? "hover:bg-red-50 hover:border-red-300"
                : "hover:bg-green-50 hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition ${
                  selectedUser.status === "Active"
                    ? "bg-red-100 group-hover:bg-red-200"
                    : "bg-green-100 group-hover:bg-green-200"
                }`}
              >
                <UserX
                  className={`w-5 h-5 ${
                    selectedUser.status === "Active"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.status === "Active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedUser.status === "Active"
                    ? "Akun tidak dapat mengakses sistem"
                    : "Pulihkan akses akun ke sistem"}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-medium ${
                selectedUser.status === "Active"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              &gt;
            </span>
          </button>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-sm">!</span>
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Perhatian:</span> Tindakan ini akan mempengaruhi akses user ke sistem. Perubahan dapat dikembalikan melalui menu kelola akun.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
