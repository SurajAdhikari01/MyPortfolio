import React from "react";

const SkillCard = ({ skill }) => {
  const { name, proficiencyLevel, icon } = skill;
  return (
    <div className="p-4 border rounded shadow-lg">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-lg">Proficiency Level: {proficiencyLevel}</p>
    </div>
  );
};

export default SkillCard;
