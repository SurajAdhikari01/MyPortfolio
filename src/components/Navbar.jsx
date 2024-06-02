import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
    setIsScrolled(window.scrollY > 50);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderLinkText = (text, icon) => (
    <div
      className={`flex items-center ${
        isMenuOpen ? "justify-start" : "justify-center"
      } transition-all duration-300 ease-in-out`}
    >
      <FontAwesomeIcon icon={icon} className={`${isMenuOpen ? "mr-2" : ""}`} />
      {isMenuOpen && <span>{text}</span>}
    </div>
  );

  return (
    <nav
      className={`fixed flex flex-col top-0 left-0 z-50 h-full bg-gray-900 text-white transition-all duration-300 ${
        isScrolled ? "bg-black" : ""
      } ${isMenuOpen ? "w-[15rem]" : "w-20"}`}
    >
      <div className="mx-auto my-8">
        <div className="flex font-bold mx-auto ">
          <Link to="/" className="text-lg flex font-bold mx-auto m-4">
            Dev
          </Link>
        </div>
        <div className="flex flex-col justify-between items-center mt-4">
          <div className="block cursor-pointer p-4" onClick={toggleMenu}>
            <div>
              <div
                className={`w-6 h-px bg-white transition-all ${
                  isMenuOpen ? "transform rotate-45 translate-y-2" : ""
                }`}
              />
              <div
                className={`w-6 h-px bg-white my-1 transition-all ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-6 h-px bg-white transition-all ${
                  isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </div>
          <ul className="flex flex-col gap-8 text-base font-medium mt-4 ">
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-yellow-400"
                onClick={closeMenu}
              >
                {renderLinkText("Instagram", faInstagram)}
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-yellow-400"
                onClick={closeMenu}
              >
                {renderLinkText("Twitter", faTwitter)}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-yellow-400"
                onClick={closeMenu}
              >
                {renderLinkText("GitHub", faGithub)}
              </a>
            </li>
          </ul>
        </div>
        <div
          className={`fixed bottom-8 right-8 w-10 h-10 bg-yellow-400 text-gray-900 flex justify-center items-center rounded-full cursor-pointer transition-opacity duration-300 ${
            scrollPosition > 200 ? "opacity-100" : "opacity-0"
          }`}
          onClick={scrollToTop}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
