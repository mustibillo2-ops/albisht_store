export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import LoginContent from './LoginContent';

const getParam = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] || fallback;
  return fallback;
};

export default async function LoginPage({ searchParams }) {
  const params = (await searchParams) || {};
  const from = getParam(params.from, '/');
  const mode = getParam(params.mode, 'customer');
  const notice = getParam(params.notice, '');

  return <LoginContent from={from} mode={mode} notice={notice} />;
}

