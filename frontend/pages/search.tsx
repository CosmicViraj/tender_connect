import { useState } from 'react';
import axios from '../lib/axios';
import Link from 'next/link';

export default function SearchCompanies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!query.trim()) return;
    const res = await axios.get(`/search?query=${query}`);
    setResults(res.data);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Companies</h1>

      <div className="flex mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, industry, or service"
          className="flex-1 border p-2 rounded-l"
        />
        <button
          onClick={search}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        results.map((c: any) => (
          <div key={c.id} className="bg-white p-4 shadow rounded mb-4">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-gray-600">{c.industry}</p>
            <p className="text-sm text-gray-500 mb-1">{c.description}</p>
            {c.logo_url && (
              <img src={c.logo_url} alt="logo" className="h-16 rounded mb-2" />
            )}
            <Link
              href={`/companies/${c.id}`}
              className="text-blue-600 text-sm underline"
            >
              View Profile →
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No companies to show.</p>
      )}
    </div>
  );
}
