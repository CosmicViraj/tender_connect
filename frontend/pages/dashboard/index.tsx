import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { getToken } from '../../lib/auth';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [company, setCompany] = useState<any>(null);
  const [tenders, setTenders] = useState([]);
  const [form, setForm] = useState({ name: '', industry: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) router.push('/auth/login');

    axios
      .get('/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCompany(res.data);
        setForm(res.data);
      })
      .catch((err) => console.error(err));

    axios
      .get('/tenders/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTenders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = () => {
    const token = getToken();
    axios
      .post('/companies', form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert('Profile updated');
        setCompany(res.data);
      });
  };

  const uploadLogo = async (e: any) => {
    const token = getToken();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('logo', file);

    const res = await axios.post('/companies/upload-logo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Logo uploaded');
    setCompany((prev: any) => ({ ...prev, logo_url: res.data.logo_url }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Company Info */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          name="industry"
          value={form.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={updateProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

        <div className="mt-4">
          <input type="file" onChange={uploadLogo} />
          {company?.logo_url && (
            <img src={company.logo_url} alt="Logo" className="h-20 mt-2 rounded" />
          )}
        </div>
      </div>

      {/* Tender Upload */}
      <TenderForm />

      {/* List Own Tenders */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Tenders</h2>
        {tenders.map((t: any) => (
          <div key={t.id} className="border p-3 mb-2 rounded">
            <h3 className="font-bold">{t.title}</h3>
            <p>{t.description}</p>
            <p className="text-sm text-gray-500">Budget: ₹{t.budget}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
