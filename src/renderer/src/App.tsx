import { useEffect, useState } from 'react';
import type { CryptoData } from '../src/env';
import './index.css'
import { Button } from "@/components/ui/button"

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const result = await window.cryptoAPI.getListings(50);
        setCryptos(result.data);
      } catch (error) {
        console.error('Erreur chargement cryptos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard Crypto</h1>
      <Button variant="ghost">test</Button>
      <table>
        <thead>
        <tr>
          <th>Nom</th>
          <th>Symbole</th>
          <th>Prix (USD)</th>
          <th>Variation 24h</th>
        </tr>
        </thead>
        <tbody>
        {cryptos.map(crypto => (
          <tr key={crypto.id}>
            <td>{crypto.name}</td>
            <td>{crypto.symbol}</td>
            <td>${crypto.quote.USD.price.toFixed(2)}</td>
            <td className={crypto.quote.USD.percent_change_24h >= 0 ? 'positive' : 'negative'}>
              {crypto.quote.USD.percent_change_24h.toFixed(2)}%
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
