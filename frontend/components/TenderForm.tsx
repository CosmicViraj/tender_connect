import { useState } from 'react';
import axios from '../lib/axios';
import { getToken } from '../lib/auth';

export default function TenderForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const token = getToken();
      await axios.post('/tenders', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Tender created!');
    } catch {
      alert('Error creating tender');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Tender</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Tender Title"
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Tender Description"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        type="date"
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="budget"
        value={form.budget}
        onChange={handleChange}
        placeholder="Budget"
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Tender
      </button>
    </div>
  );
}
