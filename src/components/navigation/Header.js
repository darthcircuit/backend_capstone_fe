import { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "../../static/images/logo.svg";
import SecurityWrapper from "../auth/SecurityWrapper";
import ProfileMenu from "./ProfileMenu";
import { MeContext } from "../routing/DefaultContainer";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const me = useContext(MeContext);
  const { searchTerm, setSearchTerm, history } = props;

  const redirectTo = (path) => {
    history.push(path);
  };

  const getSearchResults = (e) => {
    e.preventDefault();

    redirectTo(`/universal-search/${searchTerm}`);
  };

  return (
    <div className="navbar-container">
      <div className="left-column">
        <Link className="logo-wrapper nav-item" to="/home">
          <img src={Logo} alt="logo" height="18px" />
        </Link>

        <SecurityWrapper roles="super-admin">
          <NavLink to="/organizations">
            <div className="page-link nav-item">Organizations</div>
          </NavLink>
        </SecurityWrapper>

        <NavLink to="/users">
          <div className="page-link nav-item">Users</div>
        </NavLink>

        <NavLink to="/devices">
          <div className="page-link nav-item">Devices</div>
        </NavLink>
      </div>

      <div className="right-column">
        <form onSubmit={getSearchResults}>
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                lineHeight: "normal",
              }}
            />

            {!searchTerm ? (
              <FontAwesomeIcon
                icon="fa-solid fa-magnifying-glass"
                color="black"
              />
            ) : (
              <FontAwesomeIcon
                icon="fa-solid fa-x"
                color="black"
                className="icon-x"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
        </form>

        <div onClick={() => setMenuOpen(!menuOpen)} className="users_name">
          {me.first_name}&nbsp;&nbsp;
          <FontAwesomeIcon
            icon={`fas fa-chevron-${menuOpen ? "up" : "down"}`}
          />
        </div>

        {menuOpen ? (
          <ProfileMenu
            {...props}
            userFullName={me.first_name + " " + me.last_name}
            orgName={me.organization?.name}
            orgId={me.org_id}
            userID={me.user_id}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Header;
