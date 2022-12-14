import awaitAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout.js";

function Sync() {
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
    // window.location.reload(false);
  } else {
    console.log("Error");
  }
}
export default Sync;
