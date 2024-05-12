import React from "react";
import PropTypes from "prop-types";

const ProjectCard = ({ project }) => {
  const { title, description, image, githubUrl } = project;
  return (
    <div className="border rounded shadow-lg">
      <img src={image} alt={title} className="w-full rounded-t" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-lg mb-2">{description}</p>
        <a
          href={githubUrl}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    githubUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProjectCard;
