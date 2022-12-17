import { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMdmSync } from "../devices/DeviceSync.js";
import ActiveBadge from "../../custom-components/ActiveBadge";
// import { formatPhone } from "../../../util/stringUtils";
// import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";

const columns = {
  asset_id: {
    name: "Asset ID",
    selector: "asset_id",
    sortable: true,
  },
  serial_number: {
    name: "Serial Number",
    selector: "serial_number",
    sortable: true,
    width: "150px",
  },
  site_id: {
    name: "Site ID",
    selector: "site_id",
    sortable: true,
  },
  make: {
    name: "Make",
    selector: "make",
    sortable: true,
  },
  model_num: {
    name: "Model Number",
    selector: "model_num",
    sortable: true,
    width: "150px",
  },
  model_name: {
    name: "Model Name",
    selector: "model_name",
    sortable: true,
    width: "150px",
  },
  deployed: {
    name: "Asset Deployed",
    selector: "deployed",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.deployed} />,
  },
  assigned_to: {
    name: "Assigned To",
    selector: "assigned_to",
    sortable: true,
    width: "250px",
  },
  asset_tag: {
    name: "Asset Tag",
    selector: "asset_tag",
    sortable: true,
  },
  enrollment_status: {
    name: "MDM Enrollment Status",
    selector: "enrolled.enrollment_status",
    sortable: true,
    width: "150px",
    cell: (row) => <ActiveBadge active={row.enrollment_status} />,
  },
};

const AssetList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [syncMdmButtonText, MdmSync, syncMdmButtonDisable] = useMdmSync();
  const loadResults = useCallback(
    (signal) => {
      if (props.assetList) {
        setFilterText("");
        setFilteredList(props.filteredList || props.assetList);
      } else {
        let fetchUrl = "/assets/get";

        // if (props.org_id) {
        //   fetchUrl = `/user/get/organization/${props.org_id}`;
        // }

        const auth_ok = asyncAPICall(
          fetchUrl,
          "GET",
          null,
          null,
          (data) => {
            setList(data);
            setFilterText("");
            setFilteredList(data);
          },
          (err) => {
            if (!signal.aborted) {
              console.error("Error in Get Assets Effect: ", err);
            }
          },
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          item.serial_number &&
          item.serial_number.toLowerCase().includes(newFilterText)
        );
      });
    }

    setFilterText(e.target.value);
    setFilteredList(filteredList);
  };

  useDeepEffect(() => {
    // const org_id = props.org_id || "";
    // const org_name = props.org_name || "";
    let selectedColumns;

    if (props.columns) {
      selectedColumns = props.columns.split(",").map((item) => {
        return columns[item];
      });
    } else {
      selectedColumns = [
        columns.asset_tag,
        columns.deployed,
        columns.assigned_to,
        columns.serial_number,
        columns.make,
        columns.model_name,
        columns.model_num,
        // columns.enrollment_status,
      ];
    }

    setSelectedColumns(selectedColumns);

    // if (org_id) {
    // setLinkToAddUser(`/user-add/${org_id}/${org_name}/`);
    // }
  }, [props.columns, props.org_id, props.org_name]);

  useAbortEffect(
    (signal) => {
      loadResults(signal);
    },
    [props.assetList, loadResults]
  );

  return (
    <div className="asset-list-container list-page">
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
        <button
          className="confirm-button"
          disabled={syncMdmButtonDisable}
          onClick={MdmSync}
          style={{ width: "250px" }}
        >
          {syncMdmButtonText}
        </button>
      </div>

      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}></div> */}

      <div className="seperator" />
      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <FontAwesomeIcon icon="fa-solid fa-laptop-code" /> Assets Owned{" "}
            <br />
            {/* This Button will refresh the page:
            
            <button onClick={() => window.location.reload(false)}>
              Sync Database
            </button>{" "}
            
            */}
          </span>
        }
      />
    </div>
  );
};

export default AssetList;
