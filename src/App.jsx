import React, { useEffect, useState } from "react";

const assets = [
  { id: "bitcoin", label: "BTC" },
  { id: "ethereum", label: "ETH" },
  { id: "arbitrum", label: "ARB" },
  { id: "optimism", label: "OP" },
  { id: "sei", label: "SEI" },
  { id: "gmx", label: "GMX" },
  { id: "worldcoin", label: "WLD" },
  { id: "travala", label: "AVA" },
  { id: "floki-inu", label: "FLOKI" },
  { id: "solana", label: "SOL" },
  { id: "ripple", label: "XRP" },
  { id: "usd", label: "USD/TRY" },
  { id: "eur", label: "EUR/TRY" },
];

export default function App() {
  const [prices, setPrices] = useState({});
  const [investments, setInvestments] = useState({});

  useEffect(() => {
    async function fetchPrices() {
      const ids = assets.map((a) => a.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=try`
      );
      const data = await res.json();
      setPrices(data);
    }
    fetchPrices();
  }, []);

  const handleInput = (id, field, value) => {
    setInvestments((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  let totalInvested = 0;
  let totalCurrent = 0;

  assets.forEach((asset) => {
    const price = prices[asset.id]?.try || 0;
    const amount = investments[asset.id]?.amount || 0;
    const buy = investments[asset.id]?.buy || 0;
    totalInvested += amount * buy;
    totalCurrent += amount * price;
  });

  const totalProfit = totalCurrent - totalInvested;

  return (
    <div style={{ padding: 20 }}>
      <h2>Yatırım Takip Paneli</h2>
      <div style={{ display: "grid", gap: 20 }}>
        {assets.map((asset) => {
          const price = prices[asset.id]?.try || 0;
          const amount = investments[asset.id]?.amount || 0;
          const buy = investments[asset.id]?.buy || 0;
          const valueNow = amount * price;
          const valueBuy = amount * buy;
          const profit = valueNow - valueBuy;

          return (
            <div key={asset.id} style={{ border: "1px solid #ccc", padding: 10, borderRadius: 8 }}>
              <h4>{asset.label}</h4>
              <div>Fiyat: ₺{price.toFixed(2)}</div>
              <input
                type="number"
                placeholder="Alım fiyatı"
                onChange={(e) => handleInput(asset.id, "buy", e.target.value)}
              />
              <input
                type="number"
                placeholder="Adet"
                onChange={(e) => handleInput(asset.id, "amount", e.target.value)}
              />
              <div>Güncel Değer: ₺{valueNow.toFixed(2)}</div>
              <div style={{ color: profit >= 0 ? "green" : "red" }}>
                Kar/Zarar: ₺{profit.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 30, background: "#eee", padding: 20, borderRadius: 10 }}>
        <div>Toplam Yatırım: ₺{totalInvested.toFixed(2)}</div>
        <div>Toplam Varlık Değeri: ₺{totalCurrent.toFixed(2)}</div>
        <div style={{ color: totalProfit >= 0 ? "green" : "red" }}>
          Toplam Kar/Zarar: ₺{totalProfit.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
