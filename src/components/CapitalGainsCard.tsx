import React from "react";

interface Gains {
  profits: number;
  losses: number;
}

interface CapitalGainsCardProps {
  stcg: Gains;
  ltcg: Gains;
  variant?: "pre" | "post";
  realisedCapitalGains: number;
  savings?: number;
}

export const CapitalGainsCard: React.FC<CapitalGainsCardProps> = ({
  stcg,
  ltcg,
  variant = "pre",
  realisedCapitalGains,
  savings,
}) => {
  const netStcg = stcg.profits - stcg.losses;
  const netLtcg = ltcg.profits - ltcg.losses;
  const cardClass = `card ${variant === "pre" ? "card-pre" : "card-post"}`;

  return (
    <div className={cardClass}>
      <h2 className="card-title">
        {variant === "pre" ? "Pre-Harvesting" : "After Harvesting"}
      </h2>
      <div className="card-section">
        <div className="row">
          <span>Short-term Profits</span>
          <span>₹{stcg.profits.toLocaleString()}</span>
        </div>
        <div className="row">
          <span>Short-term Losses</span>
          <span>₹{stcg.losses.toLocaleString()}</span>
        </div>
        <div className="row row-bold">
          <span>Net Short-term Gains</span>
          <span>₹{netStcg.toLocaleString()}</span>
        </div>
      </div>
      <div className="card-section">
        <div className="row">
          <span>Long-term Profits</span>
          <span>₹{ltcg.profits.toLocaleString()}</span>
        </div>
        <div className="row">
          <span>Long-term Losses</span>
          <span>₹{ltcg.losses.toLocaleString()}</span>
        </div>
        <div className="row row-bold">
          <span>Net Long-term Gains</span>
          <span>₹{netLtcg.toLocaleString()}</span>
        </div>
      </div>
      <div className="row row-bold card-realised">
        <span>Realised Capital Gains</span>
        <span>₹{realisedCapitalGains.toLocaleString()}</span>
      </div>
      {savings && savings > 0 && (
        <div className="card-savings">
          You're going to save ₹{savings.toLocaleString()}
        </div>
      )}
    </div>
  );
}; 