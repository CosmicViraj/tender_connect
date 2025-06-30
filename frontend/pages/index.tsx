import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">TenderConnect</h1>
      <p className="mb-4">A minimal B2B Tender Platform</p>
      <div className="space-x-4">
        <Link href="/auth/login" className="text-blue-500 underline">
          Login
        </Link>
        <Link href="/auth/register" className="text-blue-500 underline">
          Register
        </Link>
      </div>
    </main>
  );
}
