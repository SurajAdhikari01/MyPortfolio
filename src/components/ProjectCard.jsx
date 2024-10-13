import React from "react";

const ProjectCard = ({ title, description, imageUrl }) => (
  <div className="rounded-lg shadow-lg overflow-hidden bg-white">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default ProjectCard;
