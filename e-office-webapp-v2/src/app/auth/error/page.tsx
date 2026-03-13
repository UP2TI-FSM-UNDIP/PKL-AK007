
import React from 'react';

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error || 'Unknown Error';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Login Gagal</h2>
        <div className="mt-2 text-sm text-gray-600">
          <p>Terjadi kesalahan saat melakukan autentikasi SSO.</p>
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-700 font-mono text-xs break-all">
            Error Code: {error}
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/"
            className="group relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
