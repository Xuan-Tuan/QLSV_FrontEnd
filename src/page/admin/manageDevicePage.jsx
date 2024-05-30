import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import {
  doAddDevice,
  doDeleteDocument,
} from "../../controller/firestoreController";
import { formattedDate } from "../../controller/formattedDate";
import axiosInstance from "../../controller/axiosInstance";
import ModifyDeviceForm from "./modifyForm/modifyDeviceForm";

export default function ManageDevicePage() {
  const [deviceInfo, setDeviceInfo] = useState({
    id: "",
    roomID: "",
    status: "unknown",
  });

  const [deviceList, setDeviceList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [postDataOfDate, setPostDataOfDate] = useState(
    formattedDate(new Date())
  );
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);

  const checkStatus = async () => {
    try {
      const response = await axiosInstance.post("/checkStatus");
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const resetStatus = async () => {
    try {
      const response = await axiosInstance.post("/resetDeviceStatus");
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const postDataDate = async (date) => {
    try {
      const response = await axiosInstance.post("/postDataOfDate", {
        date,
      });
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getDataOfDate = async (date) => {
    try {
      const response = await axiosInstance.post("/getDataOfDate", {
        date,
      });
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const handleGetDataOfDate = async (e) => {
    e.preventDefault();
    try {
      const result = await getDataOfDate(postDataOfDate);
      console.log(result);
      alert("Get data of date successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to get data of date");
    }
  };

  const handlePostDataOfDate = async (e) => {
    e.preventDefault();
    try {
      const result = await postDataDate(postDataOfDate);
      console.log(result);
      alert("Post data of date successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to post data of date");
    }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    try {
      const result = await checkStatus();
      console.log(result);
      alert("Check device status successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to check device status");
    }
  };

  const handleResetStatus = async (e) => {
    e.preventDefault();
    try {
      const result = await resetStatus();
      console.log(result);
      alert("Reset device status successfully");
    } catch (err) {
      console.error(err);
      if (err.message === "Network Error") {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("Failed to delete device");
      }
    }
  };

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deviceInfo.id === "" || deviceInfo.roomID === "") {
        alert("Please fill in all fields");
        setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
        return;
      }
      if (!deviceInfo.id.match(/^[0-9]+$/)) {
        alert("Device ID must be a number");
        setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
        return;
      }
      if (deviceList.some((device) => device.id === deviceInfo.id)) {
        alert("Device ID already exists");
        setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
        return;
      }
      await doAddDevice(deviceInfo);
      alert("Device added successfully");
      setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add device");
      setDeviceInfo({ ...deviceInfo, id: "", roomID: "" });
    }
  };

  const handleDeleteDevice = async (e, deviceID) => {
    e.preventDefault();
    try {
      await doDeleteDocument("device", deviceID.toString());
      alert("Device deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete device");
    }
  };

  const handleModifyDevice = (e, deviceID) => {
    e.preventDefault();
    setIsModifyFormOpen(true);
    setCurrentDeviceId(deviceID);
  };

  useEffect(() => {
    const deviceQuery = query(collection(db, "device"));
    const roomQuery = query(collection(db, "room"));

    const unsubscribeDevice = onSnapshot(deviceQuery, (snapshot) => {
      let deviceList = [];
      snapshot.forEach((doc) => {
        deviceList.push({ id: doc.id, ...doc.data() });
      });
      setDeviceList(deviceList);
    });
    const unsubscribeRoom = onSnapshot(roomQuery, (snapshot) => {
      let roomList = [];
      snapshot.forEach((doc) => {
        roomList.push(doc.id);
      });
      setRoomList(roomList);
    });

    return () => {
      unsubscribeDevice();
      unsubscribeRoom();
    };
  }, [deviceInfo]);

  return (
    <>
      <div>
        <h2>Device&apos;s List</h2>
        {deviceList.map((device) => {
          return (
            <div key={device.id}>
              <p>
                {device.id} - {device?.roomID} - {device.status}
              </p>
              <button onClick={(e) => handleModifyDevice(e, device.id)}>
                Modify
              </button>
              <button onClick={(e) => handleDeleteDevice(e, device.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
      {isModifyFormOpen && (
        <ModifyDeviceForm
          deviceId={currentDeviceId}
          deviceList={deviceList}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}
      <br />
      <div>
        <button onClick={(e) => handleCheckStatus(e)}>
          Check device status
        </button>
        <br />
        <button onClick={(e) => handleResetStatus(e)}>
          Reset device status
        </button>
        <br />
        <input
          type="date"
          onChange={(e) =>
            setPostDataOfDate(formattedDate(new Date(e.target.value)))
          }
        />
        <button onClick={(e) => handlePostDataOfDate(e)}>
          Post data of date: {postDataOfDate}
        </button>
        <br />
        <button onClick={(e) => handleGetDataOfDate(e)}>
          Get data of date: {postDataOfDate}
        </button>
      </div>
      <br />
      <br />
      <div>
        <form onSubmit={(e) => handleDeviceSubmit(e)}>
          <label>
            Device ID:
            <input
              type="text"
              name="id"
              value={deviceInfo.id}
              onChange={(e) =>
                setDeviceInfo({ ...deviceInfo, id: e.target.value })
              }
            />
          </label>
          <label>
            Room ID:
            <select
              name="roomID"
              value={deviceInfo.roomID}
              onChange={(e) =>
                setDeviceInfo({ ...deviceInfo, roomID: e.target.value })
              }
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
          <button type="submit">Add Device</button>
        </form>
      </div>

      <div>
        <h2>Device Info</h2>

        <p>Device ID: {deviceInfo.id}</p>
        <p>Room ID: {deviceInfo.roomID}</p>
        <p>Status: {deviceInfo.status}</p>
      </div>
    </>
  );
}
