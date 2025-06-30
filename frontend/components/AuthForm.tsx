import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { saveToken } from '../lib/auth';
import { useRouter } from 'next/router';

type AuthProps = {
  type: 'login' | 'register';
};

export default function AuthForm({ type }: AuthProps) {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const route = type === 'register' ? 'signup' : 'signin';
    try {
      const res = await axios.post(`/auth/${route}`, data);
      const token = res.data.token || res.data.accessToken;
      if (token) {
        saveToken(token);
        router.push('/dashboard');
      } else {
        alert('Login successful, but token not received');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Auth error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl mb-4 text-center font-bold">{type === 'login' ? 'Sign In' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {type === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}
