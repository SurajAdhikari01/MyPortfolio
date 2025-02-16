import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChevronUp,
  faHome,
  faLaptopCode,
  faEnvelope,
  faBriefcase,
  faUser,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

// Move static data outside the component
const socialLinks = [
  {
    href: "https://www.linkedin.com/in/suraj-adhikari-041667240/",
    icon: faLinkedin,
    text: "LinkedIn",
  },
  {
    href: "https://github.com/surajadhikari01",
    icon: faGithub,
    text: "GitHub",
  },
  { href: "https://twitter.com/savvyaye", icon: faTwitter, text: "Twitter" },
  {
    href: "https://www.instagram.com/xdzc0",
    icon: faInstagram,
    text: "Instagram",
  },
];

const sectionIcons = {
  home: faHome,
  about: faUser,
  skills: faLaptopCode,
  projects: faBriefcase,
  contact: faEnvelope,
};

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  // Handle scroll and intersection observer in a single effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    const sections = document.querySelectorAll("section");
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, [setIsMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLinkText = (text, id) => (
    <motion.div
      className={`flex items-center relative transition-all duration-300 ease-in-out h-8 ${
        isMenuOpen ? "justify-start" : "justify-center w-full"
      } group`}
    >
      <motion.div
        className="flex items-center"
        animate={{
          justifyContent: isMenuOpen ? "flex-start" : "center",
          width: isMenuOpen ? "auto" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <FontAwesomeIcon
          icon={sectionIcons[id]}
          className={`transition-all duration-300 ease-in-out ${
            activeSection === id ? "text-blue-400" : ""
          }`}
        />
        <AnimatePresence>
          {isMenuOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`ml-4 overflow-hidden whitespace-nowrap ${
                activeSection === id ? "text-blue-400" : ""
              }`}
            >
              {text}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {activeSection === id && (
        <motion.span
          layoutId="activeSection"
          initial={{ scale: 0.8, borderRadius: "50%" }}
          animate={{ scale: 1, borderRadius: "0%" }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      )}
    </motion.div>
  );

  // Consolidated effect to manage scrolling on mobile based on menu state and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed flex flex-col top-0 left-0 z-50 h-full bg-gray-900 text-white overflow-hidden transition-all duration-300 
      ${isMenuOpen ? "md:w-[15rem] w-full" : "w-16"}`}
    >
      <div className="mx-auto my-8 h-screen flex flex-col justify-between">
        <div>
          <motion.a
            href="/"
            className="text-2xl font-bold mx-auto m-4 block text-center cursor-pointer text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faCode} />
          </motion.a>
          <motion.div
            className="block cursor-pointer p-4 mb-8"
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 mx-auto">
              <motion.div
                animate={
                  isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="w-full h-px mb-1 bg-white"
              />
              <motion.div
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-px mb-1 bg-white"
              />
              <motion.div
                animate={
                  isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="w-full h-px bg-white"
              />
            </div>
          </motion.div>
          <ul className="flex flex-col gap-8 text-base font-medium mt-4">
            {["home", "about", "skills", "projects", "contact"].map(
              (section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    onClick={closeMenu}
                    className="flex items-center hover:text-blue-400 transition-colors text-white"
                  >
                    {renderLinkText(
                      section.charAt(0).toUpperCase() + section.slice(1),
                      section
                    )}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <ul className="flex h-6 flex-col gap-8 text-base font-medium mb-36">
          {socialLinks.map(({ href, icon, text }) => (
            <li key={text}>
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center hover:text-blue-400 transition-colors ${
                  isMenuOpen ? "justify-start" : "justify-center w-full"
                } text-white`}
                onClick={closeMenu}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex items-center h-5"
                  animate={{
                    justifyContent: isMenuOpen ? "flex-start" : "center",
                    width: isMenuOpen ? "auto" : "100%",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className="transition-all duration-300 ease-in-out"
                  />
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-4 overflow-hidden whitespace-nowrap"
                      >
                        {text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.a>
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        className="fixed bottom-8 right-8 w-10 h-10 bg-blue-500 text-white flex justify-center items-center rounded-full cursor-pointer shadow-lg"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: scrollPosition > 200 ? 1 : 0,
          y: scrollPosition > 200 ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </motion.div>
    </nav>
  );
}

export default Navbar;
