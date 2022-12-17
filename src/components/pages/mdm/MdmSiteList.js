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
  mdm_site_id: {
    name: "MDM Site ID",
    selector: "mdm_site_id",
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
    width: "200px",
  },

  api_token: {
    name: "API Token",
    sortable: false,
    cell: (row) => <div>Hidden</div>,
  },

  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <div className="delete-edit-buttons" style={{ display: "flex" }}>
        <div>
          <Link to={{ pathname: `/mdmsite-form/edit/${row.mdm_site_id}` }}>
            <button
              className="confirm-button"
              style={{ width: "65px", marginRight: "2px" }}
            >
              Edit
            </button>
          </Link>
        </div>
        <div>
          {" "}
          <Link to={{ pathname: `/mdmsite/del/${row.mdm_site_id}` }}>
            <button
              className="confirm-button"
              style={{
                width: "80px",
                backgroundColor: "#FF5F5F",
                marginLeft: "2px",
              }}
            >
              Delete
            </button>
          </Link>
        </div>
      </div>
    ),
  },
  width: "200px",
};

const MdmSiteList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(
    (signal) => {
      if (props.orgList) {
        setList(props.mdmSiteList);
        setFilterText("");
        setFilteredList(props.mdmSiteList);
      } else {
        let auth_ok = asyncAPICall(
          "/mdmsites/get",
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => console.error("Mdm Site get error: ", err),
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
        columns.api_token,
        columns.edit_button,
        // columns.del_button,
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
    <div className="asset-container">
      <div className="seperator" />
      <div className="button-and-search">
        {/* {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            className="org-filter"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
          />
        ) : null} */}
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/mdmsite-form">
            <button className="confirm-button">
              <FontAwesomeIcon icon="fas fa-plus" /> Add New MicroMDM Site
            </button>
          </Link>
        ) : null}
      </div>

      {/* Refactor Datatable to be our own */}
      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <h2>
            <FontAwesomeIcon icon="fas fa-bars-progress" /> MicroMDM Sites
          </h2>
        }
      />
    </div>
  );
};

export default MdmSiteList;
