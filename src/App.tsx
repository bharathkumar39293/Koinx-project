import React, { useEffect, useState } from "react";
import { fetchHoldings } from "./api/holdings";
import { fetchCapitalGains } from "./api/capitalGains";
import { CapitalGainsCard } from "./components/CapitalGainsCard";
import { HoldingsTable } from "./components/HoldingsTable";
import type { Holding } from "./components/HoldingsTable";
import "./index.css";

function calcAfterHarvesting(
  base: { stcg: { profits: number; losses: number }; ltcg: { profits: number; losses: number } },
  holdings: Holding[],
  selected: Set<string>
) {
  let stcg = { ...base.stcg };
  let ltcg = { ...base.ltcg };
  for (const h of holdings) {
    if (!selected.has(h.coin)) continue;
    if (h.stcg.gain > 0) stcg.profits += h.stcg.gain;
    if (h.stcg.gain < 0) stcg.losses += Math.abs(h.stcg.gain);
    if (h.ltcg.gain > 0) ltcg.profits += h.ltcg.gain;
    if (h.ltcg.gain < 0) ltcg.losses += Math.abs(h.ltcg.gain);
  }
  return { stcg, ltcg };
}

const App: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [capitalGains, setCapitalGains] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdings, gains]) => {
        setHoldings(holdings);
        setCapitalGains(gains.capitalGains);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!capitalGains) return null;

  const pre = capitalGains;
  const after = calcAfterHarvesting(pre, holdings, selected);
  const netStcgPre = pre.stcg.profits - pre.stcg.losses;
  const netLtcgPre = pre.ltcg.profits - pre.ltcg.losses;
  const realisedPre = netStcgPre + netLtcgPre;
  const netStcgPost = after.stcg.profits - after.stcg.losses;
  const netLtcgPost = after.ltcg.profits - after.ltcg.losses;
  const realisedPost = netStcgPost + netLtcgPost;
  const savings = realisedPre > realisedPost ? realisedPre - realisedPost : 0;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto', marginBottom: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24, width: '100%' }}>
          <CapitalGainsCard
            stcg={pre.stcg}
            ltcg={pre.ltcg}
            realisedCapitalGains={realisedPre}
            variant="pre"
          />
          <CapitalGainsCard
            stcg={after.stcg}
            ltcg={after.ltcg}
            realisedCapitalGains={realisedPost}
            variant="post"
            savings={savings}
          />
        </div>
        <HoldingsTable
          holdings={holdings}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
    </div>
  );
};

export default App;
