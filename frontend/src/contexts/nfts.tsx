import type { NextApiRequest, NextApiResponse } from 'next';

const key = process.env.ALCHEMY_KEY!;
const BASE = `https://eth-sepolia.g.alchemy.com/nft/v2/${key}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, pageKey } = req.query;
  if (!owner || Array.isArray(owner)) return res.status(400).json({ error: 'owner required' });

  const url = new URL(`${BASE}/getNFTs`);
  url.searchParams.set('owner', String(owner));
  url.searchParams.set('withMetadata', 'true');
  // medya linkleri için tercih
  url.searchParams.set('excludeFilters[]', 'SPAM'); // opsiyonel
  if (pageKey && !Array.isArray(pageKey)) url.searchParams.set('pageKey', pageKey);

  const r = await fetch(url.toString());
  const data = await r.json();
  res.status(r.status).json(data);
}
