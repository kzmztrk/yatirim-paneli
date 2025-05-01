import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const assets = [
  { id: "bitcoin", label: "BTC", type: "coin" },
  { id: "ethereum", label: "ETH", type: "coin" },
  { id: "arbitrum", label: "ARB", type: "coin" },
  { id: "optimism", label: "OP", type: "coin" },
  { id: "sei", label: "SEI", type: "coin" },
  { id: "gmx", label: "GMX", type: "coin" },
  { id: "worldcoin", label: "WLD", type: "coin" },
  { id: "travala", label: "AVA", type: "coin" },
  { id: "floki-inu", label: "FLOKI", type: "coin" },
  { id: "solana", label: "SOL", type: "coin" },
  { id: "ripple", label: "XRP", type: "coin" },
  { id: "usd", label: "USD/TRY", type: "fiat" },
  { id: "eur", label: "EUR/TRY", type: "fiat" },
];

export default function YatirimPaneli() {
  const [prices, setPrices] = useState({});
  const [investments, setInvestments] = useState({});

  useEffect(() => {
    async function fetchPrices() {
      const ids = assets.map((a) => a.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,try`
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
    const price = asset.type === "coin" ? prices[asset.id]?.usd || 0 : prices[asset.id]?.try || 0;
    const amount = investments[asset.id]?.amount || 0;
    const buy = investments[asset.id]?.buy || 0;
    totalInvested += amount * buy;
    totalCurrent += amount * price;
  });

  const totalProfit = totalCurrent - totalInvested;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const price = asset.type === "coin" ? prices[asset.id]?.usd || 0 : prices[asset.id]?.try || 0;
          const amount = investments[asset.id]?.amount || 0;
          const buy = investments[asset.id]?.buy || 0;
          const valueNow = amount * price;
          const valueBuy = amount * buy;
          const profit = valueNow - valueBuy;
          const currency = asset.type === "coin" ? "$" : "₺";

          return (
            <Card key={asset.id}>
              <CardContent className="space-y-2 p-4">
                <div className="text-lg font-semibold">{asset.label}</div>
                <div>Fiyat: {currency}{price.toFixed(2)}</div>
                <Input
                  type="number"
                  placeholder="Alım fiyatı"
                  onChange={(e) => handleInput(asset.id, "buy", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Adet"
                  onChange={(e) => handleInput(asset.id, "amount", e.target.value)}
                />
                <div>Güncel Değer: {currency}{valueNow.toFixed(2)}</div>
                <div className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                  Kar/Zarar: {currency}{profit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded-xl space-y-2 text-center text-lg font-medium">
        <div>Toplam Yatırım: ₺{totalInvested.toFixed(2)}</div>
        <div>Toplam Varlık Değeri: ₺{totalCurrent.toFixed(2)}</div>
        <div className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}>
          Toplam Kar/Zarar: ₺{totalProfit.toFixed(2)}</div>
      </div>
    </div>
  );
}