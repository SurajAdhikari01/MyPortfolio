import React, { useState, useEffect } from "react";
import "./Home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faJs,
  faReact,
  faCss3Alt,
  faPython,
  faJava,
} from "@fortawesome/free-brands-svg-icons";

const languagesData = [
  { name: "HTML", category: "Frontend", icon: faHtml5 },
  { name: "JavaScript", category: "Frontend", icon: faJs },
  { name: "React", category: "Frontend", icon: faReact },
  { name: "CSS", category: "Frontend", icon: faCss3Alt },
  { name: "Python", category: "AI", icon: faPython },
  { name: "C", category: "General", icon: faPython },
  { name: "C++", category: "General", icon: faPython },
  { name: "Java", category: "General", icon: faJava },
];
const Home = ({ isMenuOpen }) => {
  const [scrollY, setScrollY] = useState(0);
  const [containerStyle, setContainerStyle] = useState({
    marginLeft: isMenuOpen ? "20rem" : "20px",
    width: isMenuOpen ? "calc(100% - 20rem)" : "calc(100% - 20px)",
    transition: "margin-left 0.3s ease, width 0.3s ease",
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const newWidth = isMenuOpen ? "calc(100% - 15rem)" : "calc(100% - 80px)";
    const newMargin = isMenuOpen ? "15rem" : "80px";
    setContainerStyle({ width: newWidth, marginLeft: newMargin });
  }, [isMenuOpen]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredLanguages =
    selectedCategory === "All"
      ? languagesData
      : languagesData.filter(
          (language) => language.category === selectedCategory
        );

  return (
    <div className="" style={containerStyle}>
      <div
        className="scroll-indicator"
        style={{
          height: `${
            (scrollY /
              (document.documentElement.scrollHeight - window.innerHeight)) *
            100
          }%`,
        }}
      ></div>
      <div className="content">
        <section
          className="intro h-screen flex  bg-gray-900"
          style={{
            backgroundPositionY: -scrollY * 0.5 + "px",
          }}
        >
          <div className="flex  sm:px-20  justify-end">
            <div className="flex my-auto ">
              <img
                src="../src/assets/avatar.avif"
                alt="Suraj Adhikari"
                className="mt-8 rounded-full"
              />
            </div>
            <div className="my-auto mx-10 flex flex-col text-gray-400">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 ">
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text  py-1 rounded">
                  Sup!
                </span>
                My Name is
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-transparent bg-clip-text  py-1 rounded">
                  Suraj Adhikari
                </span>
              </h1>
              <p className="text-lg md:text-3xl  text-gray-600">
                I am a developer
              </p>
            </div>
          </div>
        </section>

        <section
          className="skills h-screen flex flex-col items-center justify-center bg-gray-800 text-white"
          style={{
            backgroundPositionY: -scrollY * 0.5 + "px",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills</h2>
          <div className="flex justify-center mb-4">
            {["All", "Frontend", "AI", "General"].map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-2 bg-gray-900 text-white rounded ${
                  selectedCategory === category ? "bg-blue-500" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center">
            {filteredLanguages.map((language, index) => (
              <div key={index} className="flex items-center m-4">
                <FontAwesomeIcon
                  icon={language.icon}
                  size="3x"
                  className="mr-2"
                />
                <span>{language.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="projects h-screen flex items-center justify-center bg-gray-600 text-white"
          style={{
            backgroundPositionY: -scrollY * 0.5 + "px",
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-400 rounded">
                <h3 className="text-xl font-semibold mb-2">Project 1</h3>
                <p className="text-gray-300">Description of Project 1</p>
                <img
                  src="https://via.placeholder.com/400"
                  alt="Project 1"
                  className="mt-4"
                />
              </div>
              <div className="p-4 border border-gray-400 rounded">
                <h3 className="text-xl font-semibold mb-2">Project 2</h3>
                <p className="text-gray-300">Description of Project 2</p>
                <img
                  src="https://via.placeholder.com/400"
                  alt="Project 2"
                  className="mt-4"
                />
              </div>
              <div className="p-4 border border-gray-400 rounded">
                <h3 className="text-xl font-semibold mb-2">Project 3</h3>
                <p className="text-gray-300">Description of Project 3</p>
                <img
                  src="https://via.placeholder.com/400"
                  alt="Project 3"
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="contact h-screen flex items-center justify-center bg-gray-900 text-white"
          style={{
            backgroundPositionY: -scrollY * 0.5 + "px",
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h2>
            <p className="text-xl md:text-2xl">Email: example@example.com</p>
            <p className="text-xl md:text-2xl">Phone: +1234567890</p>
            <p className="text-xl md:text-2xl">
              LinkedIn: linkedin.com/[username]
            </p>
            <img
              src="https://via.placeholder.com/400"
              alt="Contact Me"
              className="mt-8"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
