import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios.get(`/companies/${id}`).then((res) => setCompany(res.data));
    }
  }, [id]);

  if (!company) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{company.name}</h1>
      <p className="text-gray-600">{company.industry}</p>
      <p className="mt-2">{company.description}</p>
      {company.logo_url && (
        <img src={company.logo_url} alt="logo" className="h-20 mt-4 rounded" />
      )}
    </div>
  );
}
