import { useState, useEffect } from "react";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const MdmSiteForm = (props) => {
  const [mdm_site_id, setMdmSiteId] = useState("");
  // const [org_id, setOrgId] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [api_token, setApiToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let fetch_url = "add";
    const form_body = new FormData(e.target);
    const body = Object.fromEntries(form_body);

    if (editing) {
      fetch_url = "update";
    }

    asyncAPICall(
      `/mdmsite/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/mdmsites`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      const mdm_site_id = props.match.params.mdm_site_id;
      // const org_id = props.match.params.org_id;
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
              // setOrgId(data.org_id);
              setName(data.name);
              setUrl(data.url);
              setApiToken(data.api_token);
              setEditing(true);
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

  useEffect(() => {
    const title = editing ? "Edit MicroMDM Site" : "Add MicroMDM Site";

    setTitle(title);
  }, [editing]);

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>

          <form className="form mdmsite-form" onSubmit={handleSubmit}>
            <label htmlFor="name">MiroMDM Site Name *</label>
            <input
              required
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="url">Base URL</label>
            <input
              id="url"
              name="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <label htmlFor="api_token">API Token</label>
            <input
              id="api_token"
              name="api_token"
              type="text"
              value={api_token}
              onChange={(e) => setApiToken(e.target.value)}
            />

            <button
              className="cancel-button"
              type="button"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </button>

            <button className="confirm-button" type="submit">
              {title}
            </button>

            {/* {org_id ? <input type="hidden" name="org_id" value={org_id} /> : ""} */}
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

export default MdmSiteForm;
