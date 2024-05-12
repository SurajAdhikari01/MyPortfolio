import React from "react";

const TestimonialCard = ({ testimonial }) => {
  const { name, role, comment } = testimonial;
  return (
    <div className="p-4 border rounded shadow-lg">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-lg mb-2">{role}</p>
      <p className="text-lg">{comment}</p>
    </div>
  );
};
export default TestimonialCard;
