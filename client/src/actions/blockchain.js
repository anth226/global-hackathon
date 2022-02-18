import { createNotification, errorMessage } from "./index";
import Client from "./api";

//= ===============================
// Blockchain actions
//= ===============================

export function keyForOwner(integra_id) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(
        `https://integraledger.azure-api.net/api/v1.5/keyforowner/${integra_id}`
      );
      return res.data;
    } catch (err) {
      createNotification(
        "Failed to get blockchain information",
        errorMessage(err)
      );
    }
  };
}

// export function keyCheck(values) {
//   return async (dispatch) => {
//     const client = Client();
//     try {
//       let res = await client.post(`${API_URL}/admin/keycheck`, values);
//       if (res.data.msg) {
//         createNotification("Check Key", res.data.msg);
//       }
//       return res.data.result;
//     } catch (err) {
//       createNotification("Check Key", errorMessage(err));
//     }
//   };
// }
