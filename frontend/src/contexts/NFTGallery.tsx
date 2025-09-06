import React from 'react';
import { useWallet } from './WalletProvider';

const getImg = (nft: any) =>
  nft?.media?.[0]?.gateway || nft?.tokenUri?.gateway || nft?.media?.[0]?.raw;

export default function NFTGallery() {
  const { isConnected, walletAddress, nfts, nextPageKey, loading, error, connectWallet, loadMore } = useWallet();

  if (!isConnected) {
    return <button onClick={connectWallet}>Cüzdanı Bağla</button>;
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <strong>Adres:</strong> {walletAddress}
      </div>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {nfts.map((n: any, i: number) => (
          <div key={`${n.contract?.address}-${n.tokenId}-${i}`} style={{ border: '1px solid #eee', borderRadius: 12, padding: 8 }}>
            <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: 8, background: '#fafafa' }}>
              {getImg(n) ? (
                <img src={getImg(n)} alt={n.title || n.tokenId} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#999' }}>No Image</div>
              )}
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              <div>{n.contract?.name || n.contract?.address.slice(0, 8)} #{n.tokenId}</div>
              {n.title && <div style={{ color: '#666' }}>{n.title}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {loading ? <span>Yükleniyor…</span> : nextPageKey ? (
          <button onClick={loadMore}>Daha Fazla Yükle</button>
        ) : (
          nfts.length > 0 && <span>Hepsi yüklendi ✔</span>
        )}
      </div>
    </div>
  );
}
