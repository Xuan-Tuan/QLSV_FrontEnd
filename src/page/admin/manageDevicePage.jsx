import { useEffect, useState } from "react";
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../../config/firebaseConfig";
// import {
//   doAddDevice,
//   doDeleteDocument,
// } from "../../controller/firestoreController";
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
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false); // Thêm state mới để điều khiển hiển thị modal chỉnh sửa
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // New state to control the visibility of the add device form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to control delete confirmation modal

  // Function to open the add device form
  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  // Function to close the add device form
  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (deviceId) => {
    setCurrentDeviceId(deviceId);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Function mở modal chỉnh sửa và thiết lập id của thiết bị đang được chỉnh sửa
  const openModifyModal = (deviceId) => {
    setCurrentDeviceId(deviceId);
    setIsModifyModalOpen(true);
  };

  // Function đóng modal chỉnh sửa
  const closeModifyModal = () => {
    setIsModifyModalOpen(false);
  };

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

      // await doAddDevice(deviceInfo);
      setDeviceList([...deviceList, deviceInfo]); // sửa code
      alert("Device added successfully");
      setIsAddFormOpen(false);
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
      // await doDeleteDocument("device", deviceID.toString());
      setDeviceList(deviceList.filter((device) => device.id !== deviceID));
      closeDeleteModal();
      alert("Device deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete device");
    }
  };

  // const handleModifyDevice = (e, deviceID) => {
  //   e.preventDefault();
  //   setIsModifyFormOpen(true);
  //   setCurrentDeviceId(deviceID);
  // };

  useEffect(() => {
    //   const deviceQuery = query(collection(db, "device"));
    //   const roomQuery = query(collection(db, "room"));

    //   const unsubscribeDevice = onSnapshot(deviceQuery, (snapshot) => {
    //     let deviceList = [];
    //     snapshot.forEach((doc) => {
    //       deviceList.push({ id: doc.id, ...doc.data() });
    //     });
    //     setDeviceList(deviceList);
    //   });
    //   const unsubscribeRoom = onSnapshot(roomQuery, (snapshot) => {
    //     let roomList = [];
    //     snapshot.forEach((doc) => {
    //       roomList.push(doc.id);
    //     });
    //     setRoomList(roomList);
    //   });

    //   return () => {
    //     unsubscribeDevice();
    //     unsubscribeRoom();
    //   };
    // }, [deviceInfo]);

    //code thay đổi
    const sampleDeviceList = [
      { id: "1", roomID: "Room1", status: "active" },
      { id: "2", roomID: "Room2", status: "inactive" },
      { id: "3", roomID: "Room1", status: "active" },
    ];

    const sampleRoomList = ["Room1", "Room2", "Room3"];

    setDeviceList(sampleDeviceList);
    setRoomList(sampleRoomList);
  }, []);

  return (
    <>
      {/* <div>
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
      </div> */}
      <div className="container mx-auto p-4 text-uit">
        <div className="text-2xl font-bold mb-4">Danh sách thiết bị</div>
        <div className="space-y-4">
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Device ID</th>
                <th className="border border-gray-400 px-4 py-2">Room ID</th>
                <th className="border border-gray-400 px-4 py-2">Status</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceList.map((device) => (
                <tr key={device.id}>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.id}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.roomID}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {device.status}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
                      onClick={() => openModifyModal(device.id)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => openDeleteModal(device.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="flex justify-start items-center m-4 space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={(e) => handleCheckStatus(e)}
            >
              Check device status
            </button>

            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
              onClick={(e) => handleResetStatus(e)}
            >
              Reset device status
            </button>
          </div>
          <div className="flex items-center justify-start m-4 space-x-4">
            <input
              type="date"
              className="border border-gray-300 p-2 rounded mb-2"
              onChange={(e) =>
                setPostDataOfDate(formattedDate(new Date(e.target.value)))
              }
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={(e) => handlePostDataOfDate(e)}
            >
              Post data of date: {postDataOfDate}
            </button>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={(e) => handleGetDataOfDate(e)}
            >
              Get data of date: {postDataOfDate}
            </button>
          </div>
        </div>
        <div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4"
            onClick={openAddForm}
          >
            Add Device
          </button>
        </div>

        {isAddFormOpen && (
          <div className="bg-white p-4 rounded shadow-md mb-4">
            <h2 className="text-xl font-bold mb-4">Add Device</h2>
            <form onSubmit={handleDeviceSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Device ID:</label>
                <input
                  type="text"
                  name="id"
                  value={deviceInfo.id}
                  onChange={(e) =>
                    setDeviceInfo({ ...deviceInfo, id: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Room ID:</label>
                <select
                  name="roomID"
                  value={deviceInfo.roomID}
                  onChange={(e) =>
                    setDeviceInfo({ ...deviceInfo, roomID: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded w-full"
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
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                  onClick={closeAddForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md">
              <p className="text-lg font-medium mb-4">
                Xác nhận xóa thiết bị này
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                  onClick={closeDeleteModal} // Close delete confirmation modal
                >
                  Hủy
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={(e) => handleDeleteDevice(e, currentDeviceId)} // Call delete function and close modal
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
        {isModifyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <ModifyDeviceForm
              deviceId={currentDeviceId}
              deviceList={deviceList}
              closeModal={() => setIsModifyModalOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
