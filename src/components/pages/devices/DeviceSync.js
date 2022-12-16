import awaitAPICall from "../../../util/apiWrapper";
import { useState } from "react";

export function useMdmSync() {
  const [syncDepButtonText, setDepButtonText] = useState(
    "Sync MicroMDM and SnipeIT"
  );
  const [isButtonDisabled, setButtonIsDisabled] = useState(false);
  const MdmSync = () => {
    setButtonIsDisabled(true);
    setDepButtonText("Loading");
    console.log("Syncing MicroMDM and SnipeIT");
    const syncUrl = "/devices/sync_all";
    const syncRun = awaitAPICall(
      syncUrl,
      "GET",
      null,
      null,
      null,
      null,
      null,
      true
    );
    if (syncRun) {
      console.log("Successfully Synced MicroMDM and SnipeIT to local Database");
      setDepButtonText("Sync Successful. Refreshing.");
      // return true;
      // window.location.reload(false);
    } else {
      console.log("Error Syncing");
      setDepButtonText("Sync Unsuccessful");
      // return false;
    }
    setTimeout(() => {
      setDepButtonText("Sync MicroMDM and SnipeIT");
      setButtonIsDisabled(false);
      window.location.reload(false);
    }, 3000);
  };
  return [syncDepButtonText, MdmSync, isButtonDisabled];
}

export function useDepSync() {
  const [syncDepButtonText, setDepButtonText] = useState(
    "Get DEP Status from Apple"
  );
  const [isButtonDisabled, setButtonIsDisabled] = useState(false);
  const DepSync = () => {
    setButtonIsDisabled(true);
    setDepButtonText("Loading");
    console.log(
      "Getting DEP Status for all enrolled devices with Apple's Servers"
    );
    const syncUrl = "/devices/dep_sync";
    const syncRun = awaitAPICall(
      syncUrl,
      "GET",
      null,
      null,
      null,
      null,
      null,
      true
    );
    if (syncRun) {
      console.log("Successfully Synced DEP status to local Database");
      setDepButtonText("Successful. Refreshing");
    } else {
      console.log("Error");
      setDepButtonText("Unsuccessful");
      // return false;
    }
    setTimeout(() => {
      setDepButtonText("Get DEP Status from Apple");
      setButtonIsDisabled(false);
      window.location.reload(false);
    }, 3000);
  };
  return [syncDepButtonText, DepSync, isButtonDisabled];
}
