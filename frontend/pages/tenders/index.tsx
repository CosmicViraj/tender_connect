import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import Link from 'next/link';

export default function TendersList() {
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    axios.get('/tenders?page=1').then((res) => setTenders(res.data.tenders));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Tenders</h1>
      {tenders.map((t: any) => (
        <div key={t.id} className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold">{t.title}</h2>
          <p className="text-gray-600 mb-2">{t.description}</p>
          <p className="text-sm text-gray-500">Company: {t.company_name}</p>
          <Link
            href={`/tenders/${t.id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View & Apply →
          </Link>
        </div>
      ))}
    </div>
  );
}
