import Link from 'next/link';
import {getServerSession} from 'next-auth';
import {redirect} from 'next/navigation';
import {ArrowRight} from 'lucide-react';
import Form from './form';

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    return redirect('/');
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">Login</h2>
        <div>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-primary underline">
            Sign up{' '}
            <ArrowRight className="mb-0.5 inline w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
      <Form />
    </>
  );
}
