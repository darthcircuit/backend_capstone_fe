import { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMdmSync, useDepSync } from "./DeviceSync.js";

import ActiveBadge from "../../custom-components/ActiveBadge";
// import { formatPhone } from "../../../util/stringUtils";
// import SecurityWrapper from "../../auth/SecurityWrapper";
import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";
import useDeepEffect from "../../../hooks/useDeepEffect.js";
import useAbortEffect from "../../../hooks/useAbortEffect.js";

const columns = {
  asset_tag: {
    name: "Asset Tag",
    selector: "asset.asset_tag",
    sortable: true,
  },
  serial_number: {
    name: "Serial Number",
    selector: "serial_number",
    sortable: true,
    width: "150px",
  },
  enrollment_status: {
    name: "MDM Enrollment Status",
    selector: "enrollment_status",
    sortable: true,
    width: "150px",
    cell: (row) => <ActiveBadge active={row.enrollment_status} />,
  },
  assigned_to: {
    name: "Assigned To",
    selector: "asset.assigned_to",
    sortable: true,
    // width: "150px",
    // cell: (row) => <ActiveBadge active={row.enrollment_status} />,
  },

  last_seen: {
    name: "Last Seen",
    selector: "last_seen",
    sortable: true,
    width: "250px",
  },
  dep_profile_status: {
    name: "DEP Profile Status",
    selector: "dep_profile_status",
    sortable: true,
    width: "150px",
    cell: (row) => <ActiveBadge active={row.dep_profile_status} />,
  },
};

const DeviceList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [syncButtonText, DepSync, syncButtonDisable] = useDepSync();
  const [syncMdmButtonText, MdmSync, syncMdmButtonDisable] = useMdmSync();
  const loadResults = useCallback(
    (signal) => {
      if (props.deviceList) {
        setFilterText("");
        setFilteredList(props.filteredList || props.deviceList);
      } else {
        let fetchUrl = "/devices/get";

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
              console.error("Error in Get Devices Effect: ", err);
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
        columns.serial_number,
        columns.assigned_to,
        columns.enrollment_status,
        columns.last_seen,
        columns.dep_profile_status,
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
    [props.deviceList, loadResults]
  );

  return (
    <div className="device-list-container list-page">
      <div className="button-and-search">
        {/* <SecurityWrapper restrict_roles="user">
            {!props.showAddButton || props.showAddButton === false ? (
              <button
                disabled={props.disableAddUser}
                // onClick={() => props.history.push(linkToAddUser)}
                className="confirm-button"
              >
                <FontAwesomeIcon icon="fas fa-plus" className="button-icon" />
                Add New User
              </button>
            ) : null}
          </SecurityWrapper> */}
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
        <button
          className="confirm-button"
          disabled={syncButtonDisable}
          onClick={DepSync}
          style={{ width: "250px" }}
        >
          {syncButtonText}
        </button>{" "}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <FontAwesomeIcon icon="fa-solid fa-laptop-code" /> Enrolled Devices{" "}
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

export default DeviceList;
