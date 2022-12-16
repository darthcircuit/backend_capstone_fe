import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import ActiveBadge from "../../custom-components/ActiveBadge";
// import { formatPhone } from "../../../util/stringUtils";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";

const columns = {
  site_id: {
    name: "Site ID",
    selector: "site_id",
    sortable: true,
    width: "100px",
  },
  name: {
    name: "Name",
    selector: "name",
    sortable: true,
    width: "100px",
  },
  url: {
    name: "Base URL",
    selector: "url",
    sortable: false,
    width: "300px",
  },
  org_id: {
    name: "Organization ID",
    selector: "org_id",
    sortable: false,
  },
  api_token: {
    name: "API Token",
    selector: "api_token",
    sortable: false,
    width: "200px",
  },

  // active: {
  //   name: "Active",
  //   selector: "active",
  //   sortable: true,
  //   cell: (row) => <ActiveBadge active={row.active} />,
  //   width: "150px",
  // },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/assetsite-form/edit/${row.site_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
};

const AssetSiteList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.orgList) {
        setList(props.assetSiteList);
        setFilterText("");
        setFilteredList(props.assetSiteList);
      } else {
        let auth_ok = asyncAPICall(
          "/asset_sites/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Asset Site get error: ", err),
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  useDeepEffect(() => {
    let selected;

    if (props.columns) {
      selected = [];
      props.columns.split(",").forEach((item) => {
        selected.push(columns[item]);
      });
    } else {
      selected = [
        columns.name,
        columns.url,
        columns.org_id,
        columns.api_token,
        // columns.active,
        columns.edit_button,
      ];
    }
    setSelectedColumns(selected);
  }, [props.columns]);

  useAbortEffect(
    (signal) => {
      loadResults(signal);
    },
    [props.orgList, loadResults]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return item.name && item.name.toLowerCase().includes(newFilterText);
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="asset-site list-page">
      <div className="seperator" />
      <div className="button-and-search">
        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="org-filter"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
          />
        ) : null}
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/assetsite-form">
            <button className="confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add New SnipeIT Site
            </button>
          </Link>
        ) : null}
      </div>

      {/* Refactor Datatable to be our own */}
      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <FontAwesomeIcon icon="fas fa-sitemap" /> SnipeIT Sites
          </span>
        }
      />
    </div>
  );
};

export default AssetSiteList;
