import { useState, useEffect, createContext } from "react";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";

import Home from "../pages/Home";
import Header from "../navigation/Header";

import Organization from "../pages/organization/OrganizationGet";
import OrganizationListPage from "../pages/organization/OrganizationListPage";
import OrganizationForm from "../pages/organization/OrganizationForm";

import User from "../pages/user/UserGet";
import UserListPage from "../pages/user/UserListPage";
import UserForm from "../pages/user/UserForm";

import DeviceListPage from "../pages/devices/DeviceListPage";

import AssetListPage from "../pages/assets/AssetListPage";
import AssetSiteListPage from "../pages/assets/AssetSiteListPage";
import AssetSiteForm from "../pages/assets/AssetSiteForm";

import MdmSiteListPage from "../pages/mdm/MdmSiteListPage";
import MdmSiteForm from "../pages/mdm/MdmSiteForm";

import Loading from "../../util/Loading";
import ProfileEditPage from "../pages/ProfileEditPage";
import UniversalSearch from "../pages/UniversalSearch";
import logout from "../../util/logout";
import awaitAPICall from "../../util/apiWrapper";
import useAbortEffect from "../../hooks/useAbortEffect";

export const MeContext = createContext();

const DefaultContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [me, setMe] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let auth_token_from_cookie = Cookies.get("auth_token");
    let expiration = Cookies.get("auth_expires");
    let is_expired = Date.parse(expiration) < Date.now();

    if (!auth_token_from_cookie || is_expired) {
      logout(props);
    }
  });

  useAbortEffect((signal) => {
    setIsLoading(true);
    awaitAPICall(
      "/user/get/me",
      "GET",
      null,
      null,
      (data) => {
        if (data) {
          setMe(data);
        }
        setIsLoading(false);
      },
      (err) => {
        if (!signal.aborted) {
          console.error("Error in Get Me Effect: ", err);
        }
        setIsLoading(false);
      },
      signal
    );
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MeContext.Provider value={me}>
      <Route
        path="/"
        render={(routeProps) => (
          <Header
            {...routeProps}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      />

      <div className="body-container">
        <Route path="/home" component={Home} />

        <Route path="/users" component={UserListPage} />
        <Route exact path="/user-add" component={UserForm} />
        <Route path="/user-add/:org_id/:org_name" component={UserForm} />
        <Route path="/user/:user_id" component={User} />
        <Route path="/user/edit/:user_id" component={UserForm} />
        <Route path="/profile/edit/:user_id" component={ProfileEditPage} />

        <Route path="/devices" component={DeviceListPage} />

        <Route path="/assets" component={AssetListPage} />
        <Route path="/asset-sites" component={AssetSiteListPage} />
        <Route exact path="/assetsite-form" component={AssetSiteForm} />
        <Route
          exact
          path="/assetsite-form/edit/:site_id"
          component={AssetSiteForm}
        />

        <Route path="/mdmsites" component={MdmSiteListPage} />
        <Route exact path="/mdmsite-form" component={MdmSiteForm} />
        <Route
          exact
          path="/mdmsite-form/edit/:mdm_site_id"
          component={MdmSiteForm}
        />

        <Route exact path="/organization-form" component={OrganizationForm} />
        <Route path="/organization-form/:org_id" component={OrganizationForm} />
        <Route path="/organizations" component={OrganizationListPage} />
        <Route path="/organization/:org_id" component={Organization} />

        <Route
          path="/universal-search"
          render={(routeProps) => {
            return (
              <UniversalSearch
                {...routeProps}
                searchTerm={searchTerm}
                authToken={props.authToken}
              />
            );
          }}
        />
      </div>
    </MeContext.Provider>
  );
};

export default DefaultContainer;
