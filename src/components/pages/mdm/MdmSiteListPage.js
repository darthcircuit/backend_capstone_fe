import MdmSiteList from "./MdmSiteList";
import Cookies from "js-cookie";
import SecurityWrapper from "../../auth/SecurityWrapper";
import logout from "../../../util/logout";

export default function MdmSiteListPage(props) {
  const authToken = Cookies.get("auth_token");
  if (!authToken) {
    //props.history.push('/login');
    logout(props);
  }

  return (
    <div className="list-container">
      <SecurityWrapper roles="super-admin,admin">
        <MdmSiteList {...props} authToken={authToken} />
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
