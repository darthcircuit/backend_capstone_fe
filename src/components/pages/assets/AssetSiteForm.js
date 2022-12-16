import { useState, useEffect } from "react";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";
import useAbortEffect from "../../../hooks/useAbortEffect";

const AssetSiteForm = (props) => {
  const [site_id, setSiteId] = useState("");
  const [org_id, setOrgId] = useState("");
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
      `/asset_site/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/asset-sites`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      const site_id = props.match.params.site_id;
      // const org_id = props.match.params.org_id;

      if (site_id) {
        const auth_ok = asyncAPICall(
          `/asset_site/get/${site_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.site_id) {
              console.log("ERROR: asset_site not found");
            } else {
              setSiteId(data.site_id);
              setOrgId(data.org_id);
              setName(data.name);
              setUrl(data.url);
              setApiToken(data.api_token);
              setEditing(true);
            }
          },
          (err) => console.error("Error in Get AssetSiteForm Effect: ", err),
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
    const title = editing ? "Edit SnipeIT Site" : "Add SnipeIT Site";

    setTitle(title);
  }, [editing]);

  return (
    <div className="form-container">
      <div className="form-field-wrapper">
        <div className="form-wrapper">
          <h2>{title}</h2>

          <form className="form assetsite-form" onSubmit={handleSubmit}>
            <label htmlFor="name">SnipeIT Site Name *</label>
            <input
              required
              id="site_id"
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

            {org_id ? <input type="hidden" name="org_id" value={org_id} /> : ""}
            {site_id ? (
              <input type="hidden" name="site_id" value={site_id} />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssetSiteForm;
