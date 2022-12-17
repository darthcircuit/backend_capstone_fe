import { useState } from "react";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const MdmSiteDel = (props) => {
  const [mdm_site_id, setMdmSiteId] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form_body = new FormData(e.target);
    const body = Object.fromEntries(form_body);

    asyncAPICall(
      `/mdmsite/del/${mdm_site_id}`,
      "DELETE",
      body,
      null,
      (data) => {
        props.history.push(`/devices`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      const mdm_site_id = props.match.params.mdm_site_id;
      if (mdm_site_id) {
        const auth_ok = asyncAPICall(
          `/mdmsite/get/${mdm_site_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.mdm_site_id) {
              console.log("ERROR: mdmsite not found");
            } else {
              setMdmSiteId(data.mdm_site_id);
              setName(data.name);
              setUrl(data.url);
            }
          },
          (err) => console.error("Error in Get MdmSite Effect: ", err),
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h1>Remove a MicroMDM Site</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <h2 style={{ width: "300px" }}>MiroMDM Site Name</h2>
              {name}

              <br />
              <h2>Base URL</h2>
              {url}

              <div className="confirm">
                <br />
                <input
                  type="checkbox"
                  required
                  id="confirm"
                  name="confirm"
                  value="confirm"
                  checked={isChecked}
                  onChange={handleOnChange}
                />
                * Confirm Deletion
              </div>
            </div>
            <br />

            <button
              className="cancel-button"
              type="button"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </button>

            <button
              className="confirm-button"
              type="submit"
              style={{ backgroundColor: "##FF5F5F" }}
            >
              Remove a MicroMDM Site
            </button>

            {mdm_site_id ? (
              <input type="hidden" name="mdm_site_id" value={mdm_site_id} />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MdmSiteDel;
