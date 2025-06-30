import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';
import { getToken } from '../../lib/auth';

export default function TenderDetails() {
  const [tender, setTender] = useState<any>(null);
  const [proposal, setProposal] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id)
      axios.get(`/tenders/${id}`).then((res) => setTender(res.data));
  }, [id]);

  const submitProposal = async () => {
    try {
      const token = getToken();
      await axios.post(`/applications/${id}`, { proposal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Proposal submitted!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error submitting proposal');
    }
  };

  if (!tender) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{tender.title}</h1>
      <p className="text-gray-700 mt-2">{tender.description}</p>
      <p className="text-sm text-gray-500 mt-1">By: {tender.company_name}</p>
      <p className="mt-1 text-sm text-gray-600">Budget: ₹{tender.budget}</p>

      <div className="mt-6">
        <textarea
          placeholder="Your proposal..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={submitProposal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
}
