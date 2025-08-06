import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import logo from "./logo.svg";
// import { FiSearch } from 'react-icons/fi';
import { Spin as Hamburger } from "hamburger-react";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //  responsive nav
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const menuRef = useRef(null);
  const OutClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", OutClick);

    return () => {
      document.removeEventListener("click", OutClick);
    };
  }, [isOpen]);

  return (
    <div>
      <div className="navbar">
        <div>
          <img src={logo} alt="logo-head" />
          <input placeholder="Search" type="search" />
        </div>

        {/* <button className="nav-btn" ref={menuRef} onClick={toggleMenu}>
        <Hamburger
              rounded
              hideOutline={true}
              size={30}
              direction="left"
              color="#84f019"
              distance="lg"
            />
        </button> */}

        <div>
        {isMobile && (
          <div ref={menuRef}>
            <button className="nav-btn" onClick={toggleMenu}>
              <Hamburger
                rounded
                size={30}
                direction="left"
                color="#84f019"
                distance="lg"
                toggled={isOpen}
                toggle={setIsOpen}
              />
            </button>
          </div>
        )}
          {/* {isMobile && (
            <button className="nav-btn" ref={menuRef} onClick={toggleMenu}>
              <Hamburger
                rounded
                size={30}
                direction="left"
                color="#84f019"
                distance="lg"
                ref={menuRef}
                onClick={toggleMenu}
                toggled={isOpen}
                toggle={setIsOpen}
              />
            </button>
          )} */}
          {/* ) : ( */}
          <ul className={`navPhone ${isOpen ? "navPhoneComes" : ""}`}>
            <li>
              <a href="/">Locations</a>
            </li>
            <li>
              <a href="/">Services</a>
            </li>
            <li>
              <a href="/">My Bookings</a>
            </li>
            <li>
              <a href="/">
                <button>Login/Register</button>
              </a>
            </li>
            <li>
              <a href="/">
                <button>Join Now</button>
              </a>
            </li>
          </ul>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Header;
