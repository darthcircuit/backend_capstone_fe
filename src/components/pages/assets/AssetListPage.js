import AssetList from "./AssetList";
import Cookies from "js-cookie";
import SecurityWrapper from "../../auth/SecurityWrapper";
import logout from "../../../util/logout";
import AssetSiteList from "./AssetSiteList";
export default function AssetListPage(props) {
  const authToken = Cookies.get("auth_token");
  if (!authToken) {
    props.history.push("/login");
    logout(props);
  }

  return (
    <div className="asset-container">
      <SecurityWrapper roles="super-admin,admin">
        <div>
          <AssetSiteList {...props} authToken={authToken} />
        </div>
        <br />
        <hr style={{ opacity: 0.2 }} />
        <br />
        <br />
        <div>
          <AssetList {...props} authToken={authToken} />
        </div>
      </SecurityWrapper>

      {/* <SecurityWrapper roles="user">
        <AssetList
          {...props}
          authToken={authToken}
          columns="first_name,last_name,email,phone,active"
        />
      </SecurityWrapper> */}
    </div>
  );
}
