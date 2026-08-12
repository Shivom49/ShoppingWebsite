import "./aboutUs.css";
import {
    FaInstagram,
    FaLinkedin,
    FaGithub,
    FaCode
} from "react-icons/fa";

export default function AboutUs() {
    return (
        <section className="aboutUs-wrapper">

            <div className="about-card">

                {/* Profile Image */}
                <div className="profile-section">
                    <div className="image-border">
                        <img
                            src="/profile-pic.png"
                            alt="Shivom Parashari"
                            className="profile-image"
                        />
                    </div>

                    <div className="availability">
                        <span className="status-dot"></span>
                        Available for opportunities
                    </div>
                </div>

                {/* About Content */}
                <div className="content-inner">

                    <span className="about-label">
                        <FaCode />
                        ABOUT ME
                    </span>

                    <h2>Shivom Parashari</h2>

                    <h4>
                        Full Stack Developer
                        <span> • </span>
                        AI/ML Enthusiast
                    </h4>

                    <p>
                        I'm a Full Stack Web Developer and AI/ML enthusiast
                        skilled in the <strong>MERN stack</strong>,{" "}
                        <strong>Python</strong>, and <strong>C++</strong>.
                        I enjoy building modern web applications and machine
                        learning projects that solve real-world problems.
                    </p>

                    <p>
                        I'm passionate about learning new technologies,
                        improving my development skills, and creating
                        user-friendly applications. My goal is to continuously
                        grow as a developer while building impactful software
                        through creativity, problem-solving, and innovation.
                    </p>

                    {/* Social Links */}
                    <div className="social-section">

                        <span className="social-text">
                            Let's connect
                        </span>

                        <div className="social-icons">

                            <a
                                className="instagram"
                                href="https://www.instagram.com/shivam_parashari_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                className="linkedin"
                                href="https://www.linkedin.com/in/shivom-parashari-386467289"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin />
                            </a>

                            {/* <a
                                className="github"
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <FaGithub />
                            </a> */}

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}