import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  doGetDeviceData,
  updateDeviceData,
} from "../../../controller/firestoreController";
import { db } from "../../../config/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

ModifyDeviceForm.propTypes = {
  deviceId: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
};

function ModifyDeviceForm({ deviceId, closeForm }) {
  const [deviceData, setDeviceData] = useState({
    id: "",
    roomID: "",
    status: "",
  });
  const [roomList, setRoomList] = useState([]);

  // Fetch the current data of the device when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    doGetDeviceData(deviceId).then((data) => {
      setDeviceData(data);
    });
    const roomQuery = query(collection(db, "room"));
    const unsubscribeRoom = onSnapshot(roomQuery, (snapshot) => {
      let roomList = [];
      snapshot.forEach((doc) => {
        roomList.push(doc.id);
      });
      setRoomList(roomList);
    });
    return () => {
      unsubscribeRoom();
    };
  }, [deviceId]);

  const handleInputChange = (event) => {
    setDeviceData({
      ...deviceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (deviceData.roomID === "") {
      alert("Please select a room");
      return;
    }
    // Replace this with your actual update logic
    updateDeviceData(deviceId, deviceData).then(() => {
      closeForm();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID:
        <input
          type="text"
          name="id"
          value={deviceData.id}
          onChange={handleInputChange}
          disabled
        />
      </label>
      <label>
        Room ID:
        <select
          name="roomID"
          value={deviceData.roomID}
          onChange={handleInputChange}
        >
          <option value="">Select Room</option>
          {roomList.map((roomID) => {
            return (
              <option key={roomID} value={roomID}>
                {roomID}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        Status:
        <input
          type="text"
          name="status"
          value={deviceData.status}
          onChange={handleInputChange}
          disabled
        />
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={closeForm}>
        Cancel
      </button>
    </form>
  );
}

export default ModifyDeviceForm;
