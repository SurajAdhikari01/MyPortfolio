import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useViewportScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faMedium,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faCode,
  faCog,
  faServer,
  faMobile,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
} from "recharts";
import axios from "axios";
import { GraphQLClient, gql } from "graphql-request";

const GITHUB_USERNAME = "surajadhikari01";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const useIntersectionObserver = (options) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isIntersecting];
};

const useMouseParallax = (depth = 10) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * depth;
      const y = (clientY / window.innerHeight - 0.5) * depth;
      setPosition({ x, y });
    },
    [depth]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return position;
};

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(displayValue);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.onChange((v) => {
      setDisplayValue(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  return <span>{displayValue}</span>;
};

const CodeSnippet = ({ code, language }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <pre
      className={`language-${language} p-4 rounded-lg flex transition-all duration-300 ${
        isHovered ? "bg-gray-700" : "bg-gray-800"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <code>{code}</code>
      {isHovered && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          {language}
        </div>
      )}
    </pre>
  );
};

const fetchGitHubContributionActivity = async (username, token) => {
  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const CONTRIBUTION_QUERY = gql`
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(CONTRIBUTION_QUERY, { username });
    return data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({
        date: day.date,
        contributions: day.contributionCount,
      }));
  } catch (error) {
    console.error("Error fetching GitHub activity data:", error);
    return [];
  }
};

const useGitHubData = (username) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
          }),
          axios.get(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
            {
              headers: { Authorization: `token ${GITHUB_TOKEN}` },
            }
          ),
        ]);

        const reposData = reposResponse.data;

        const reposWithLanguages = await Promise.all(
          reposData.map(async (repo) => {
            const languagesResponse = await axios.get(repo.languages_url, {
              headers: { Authorization: `token ${GITHUB_TOKEN}` },
            });
            return {
              ...repo,
              languages: languagesResponse.data,
            };
          })
        );

        const languageTotals = reposWithLanguages.reduce((acc, repo) => {
          Object.entries(repo.languages).forEach(([lang, bytes]) => {
            acc[lang] = (acc[lang] || 0) + bytes;
          });
          return acc;
        }, {});

        setUserData(userResponse.data);
        setRepos(reposWithLanguages);
        setLanguages(languageTotals);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { userData, repos, languages, loading, error };
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const Home = ({ isMenuOpen }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const [theme, setTheme] = useState("dark");
  const { scrollYProgress } = useViewportScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const pathLength = useSpring(yRange, { stiffness: 400, damping: 90 });
  const [githubActivity, setGithubActivity] = useState([]);
  const mousePosition = useMouseParallax(20);

  const { userData, repos, languages, loading, error } =
    useGitHubData(GITHUB_USERNAME);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      const activity = await fetchGitHubContributionActivity(
        GITHUB_USERNAME,
        GITHUB_TOKEN
      );
      setGithubActivity(activity);
    };
    fetchActivity();
  }, []);

  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const skillDistribution = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const totalBytes = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0
  );
  const skills = Object.entries(languages)
    .map(([name, bytes]) => ({ name, level: (bytes / totalBytes) * 100 }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 8);

  return (
    <motion.div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } overflow-hidden text-${
        theme === "dark" ? "white" : "gray-900"
      } min-h-screen relative`}
      initial={false}
      animate={{
        marginLeft: isMenuOpen ? "16rem " : "5rem",
        width: isMenuOpen ? "calc(100% - 16rem)" : "calc(100% - 5rem)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <header
        ref={heroRef}
        id="home"
        className="container mx-auto py-20 px-4 relative overflow-hidden flex items-center justify-center min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0">
              {userData && (
                <img
                  src={userData.avatar_url}
                  alt={userData.name}
                  className="rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover"
                />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Suraj Adhikari
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8">
                Full Stack Developer | AI Enthusiast | Open Source Contributor
              </p>
              <div className="flex justify-center md:justify-start space-x-6 mt-6">
                {[
                  {
                    icon: faGithub,
                    link: `https://github.com/${GITHUB_USERNAME}`,
                  },
                  {
                    icon: faLinkedin,
                    link: "https://www.linkedin.com/in/suraj-adhikari-041667240/",
                  },
                  { icon: faTwitter, link: "https://twitter.com/savvyaye" },
                  { icon: faMedium, link: "https://medium.com/@yourusername" },
                  {
                    icon: faStackOverflow,
                    link: "https://stackoverflow.com/users/youruserid",
                  },
                  {
                    icon: faEnvelope,
                    link: "mailto:surajadhikari01+portfolio@icolud.com",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:text-blue-400 transition-colors"
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <motion.section
        className="container mx-auto py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        id="about"
      >
        <h2 className="text-4xl font-semibold mb-12 text-center">About Me</h2>
        <motion.p
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-center leading-relaxed"
          variants={itemVariants}
        >
          I'm a passionate software engineer with expertise in cutting-edge
          technologies. My work spans from developing AI-powered applications to
          building scalable cloud infrastructures. I thrive on solving complex
          problems and creating innovative solutions that push the boundaries of
          what's possible in tech.
        </motion.p>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-16"
          variants={itemVariants}
        >
          {[
            {
              icon: faCode,
              text: "Lines of Code",
              value: Object.values(languages).reduce(
                (sum, bytes) => sum + bytes,
                0
              ),
            },
            { icon: faCog, text: "Projects Completed", value: repos.length },
            {
              icon: faServer,
              text: "Commits",
              value: githubActivity.reduce(
                (sum, day) => sum + day.contributions,
                0
              ),
            },
            {
              icon: faMobile,
              text: "Active Days",
              value: githubActivity.filter((day) => day.contributions > 0)
                .length,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-4xl mb-4 text-blue-400"
              />
              <p className="text-lg">
                <AnimatedNumber value={item.value} />
                {typeof item.value === "number" && item.value > 100 ? "+" : ""}
              </p>
              <p className="text-sm text-gray-400">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="container mx-auto py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        id="skills"
      >
        <h2 className="text-4xl font-semibold mb-12 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4">{skill.name}</h3>
              <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">
            Skill Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {skillDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        className="container mx-auto py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        id="projects"
      >
        <h2 className="text-4xl font-semibold mb-12 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.slice(0, 6).map((project, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg cursor-pointer group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveProject(project)}
            >
              <h3 className="text-2xl font-semibold mb-4">{project.name}</h3>
              <p className="text-gray-300 mb-6 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(project.languages).map((language, langIndex) => (
                  <span
                    key={langIndex}
                    className="bg-blue-600 bg-opacity-20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center group"
                onClick={(e) => e.stopPropagation()}
              >
                View Project
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="ml-2 transform group-hover:translate-x-1 transition-transform"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="container mx-auto py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-semibold mb-12 text-center">
          GitHub Activity
        </h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={githubActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Area
                type="monotone"
                dataKey="contributions"
                fill="#3B82F6"
                stroke="#3B82F6"
                fillOpacity={0.2}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* {<motion.section
        className="container mx-auto py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-semibold mb-12 text-center">
          Code Showcase
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CodeSnippet
            language="javascript"
            code={`
// Custom React Hook for API calls
Ignore this i will fill this later
            `}
          />
          <CodeSnippet
            language="python"
            code={`
# AI-powered text summarization
ignore this i will fill this later on
            `}
          />
        </div>
      </motion.section>} */}

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Suraj Adhikari</h3>
              <p className="text-gray-400">
                Full Stack Developer & AI Enthusiast
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-2">Connect</h4>
              <div className="flex space-x-4">
                {[
                  {
                    icon: faGithub,
                    link: `https://github.com/${GITHUB_USERNAME}`,
                  },
                  {
                    icon: faLinkedin,
                    link: "https://linkedin.com/in/yourusername",
                  },
                  { icon: faTwitter, link: "https://twitter.com/yourusername" },
                  { icon: faMedium, link: "https://medium.com/@yourusername" },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2024 Suraj Adhikari. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
