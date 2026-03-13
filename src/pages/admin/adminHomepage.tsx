import React from "react";
import { Cards } from "../../components/Cards";
import { hompageCardData } from "../../utils/mockdata";

export const AdminHomepage: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hompageCardData.map((card, i) => (
          <Cards
            key={i}
            cardTitle={card.cardTitle}
            data={card.data}
            message={card.message}
          />
        ))}
      </div>
      <br />
      <h1>table for analytics or pie graph</h1>
    </div>
  );
};
