import { redirect } from 'next/navigation';

export default function SSOBridgePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Login Failed</h1>
          <p className="mt-2 text-gray-600">Missing session token from SSO.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  // Redirect to the actual backend plugin to set cookies
  // We use the Better Auth endpoint mounted at /api/auth/sso/callback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://apps-fsm.undip.ac.id/persuratan-keterangan-mhs-api';
  
  // Construct the backend plugin URL (REMOVED trailing slash for Better Auth compatibility)
  const backendPluginUrl = `${apiUrl}/api/auth/sso/callback?token=${token}`;
  console.log("Redirecting to backend plugin:", backendPluginUrl);

  redirect(backendPluginUrl);
}
