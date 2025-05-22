import React, { useState } from "react";

type Gain = { gain: number; balance: number };
export type Holding = {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: Gain;
  ltcg: Gain;
};

interface HoldingsTableProps {
  holdings: Holding[];
  selected: Set<string>;
  onSelect: (selected: Set<string>) => void;
  viewAll?: boolean;
}

const PAGE_SIZE = 8;

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  selected,
  onSelect,
  viewAll = false,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayHoldings = showAll || viewAll ? holdings : holdings.slice(0, PAGE_SIZE);
  const allSelected = displayHoldings.every((h) => selected.has(h.coin));

  const toggleAll = () => {
    const newSelected = new Set(selected);
    if (allSelected) {
      displayHoldings.forEach((h) => newSelected.delete(h.coin));
    } else {
      displayHoldings.forEach((h) => newSelected.add(h.coin));
    }
    onSelect(newSelected);
  };

  const toggleOne = (coin: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(coin)) newSelected.delete(coin);
    else newSelected.add(coin);
    onSelect(newSelected);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="table-header">
            <th className="table-cell">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            </th>
            <th className="table-cell text-left">Asset</th>
            <th className="table-cell text-right">Holdings / Avg Buy Price</th>
            <th className="table-cell text-right">Current Price</th>
            <th className="table-cell text-right">Short-Term Gain</th>
            <th className="table-cell text-right">Long-Term Gain</th>
            <th className="table-cell text-right">Amount to Sell</th>
          </tr>
        </thead>
        <tbody>
          {displayHoldings.map((h) => (
            <tr key={h.coin} className="table-row">
              <td className="table-cell">
                <input
                  type="checkbox"
                  checked={selected.has(h.coin)}
                  onChange={() => toggleOne(h.coin)}
                />
              </td>
              <td className="table-cell asset-cell">
                <img src={h.logo} alt={h.coin} className="asset-logo" />
                <div className="asset-info">
                  <div className="asset-symbol">{h.coin}</div>
                  <div className="asset-name">{h.coinName}</div>
                </div>
              </td>
              <td className="table-cell text-right">
                <div>{h.totalHolding}</div>
                <div className="cell-subtext">₹{h.averageBuyPrice.toLocaleString()}</div>
              </td>
              <td className="table-cell text-right">₹{h.currentPrice.toLocaleString()}</td>
              <td className="table-cell text-right">
                <div className={h.stcg.gain > 0 ? "gain-pos" : h.stcg.gain < 0 ? "gain-neg" : undefined}>
                  ₹{h.stcg.gain.toLocaleString()}
                </div>
                <div className="cell-subtext">{h.stcg.balance}</div>
              </td>
              <td className="table-cell text-right">
                <div className={h.ltcg.gain > 0 ? "gain-pos" : h.ltcg.gain < 0 ? "gain-neg" : undefined}>
                  ₹{h.ltcg.gain.toLocaleString()}
                </div>
                <div className="cell-subtext">{h.ltcg.balance}</div>
              </td>
              <td className="table-cell text-right">
                {selected.has(h.coin) ? h.totalHolding : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!showAll && holdings.length > PAGE_SIZE && !viewAll && (
        <div className="view-all-container">
          <button
            className="view-all-btn"
            onClick={() => setShowAll(true)}
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}; 