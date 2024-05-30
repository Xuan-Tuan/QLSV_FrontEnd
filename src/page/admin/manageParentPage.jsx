import { useEffect, useState } from "react";
import axiosInstance from "../../controller/axiosInstance";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, query } from "firebase/firestore";
import {
  doDeleteDocument,
  doDeleteParentOfStudent,
} from "../../controller/firestoreController";
import ModifyParentForm from "./modifyForm/modifyParentForm";

export default function ManageParentPage() {
  const [parents, setParents] = useState([]);
  const [authPar, setAuthPar] = useState({
    email: "",
    password: "",
    role: "parent",
  });
  const [parInfo, setParInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  const [currentParentId, setCurrentParentId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);

  const addParent = async (data) => {
    const response = await axiosInstance.post("/addParent", data);
    return response;
  };

  const deleteParent = async (id) => {
    const response = await axiosInstance.post("/deleteParent", { id });
    return response;
  };

  const handleModifyParent = (e, parentId) => {
    e.preventDefault();
    setIsModifyFormOpen(true);
    setCurrentParentId(parentId);
  };

  const handleDeleteParent = async (e, id) => {
    e.preventDefault();
    try {
      await doDeleteDocument("parent", id);
      await doDeleteDocument("authentication", id);
      await doDeleteParentOfStudent(id);
      const result = await deleteParent(id);
      console.log(result);
      alert("Parent deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete parent");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !authPar.email ||
        !authPar.password ||
        !parInfo.name ||
        !parInfo.address ||
        !parInfo.phoneNumber
      ) {
        alert("Please fill in all fields");
        setAuthPar({ email: "", password: "", role: "parent" });
        setParInfo({ name: "", address: "", phoneNumber: "" });
        return;
      }
      if (authPar.password.length < 6) {
        alert("Password must be at least 6 characters");
        setAuthPar({ ...authPar, password: "" });
        return;
      }
      if (parInfo.phoneNumber.length < 10) {
        alert("Phone number must be at least 10 characters");
        setParInfo({ ...parInfo, phoneNumber: "" });
        return;
      }
      const isPhoneNumberValid = /^\d+$/.test(parInfo.phoneNumber);
      if (!isPhoneNumberValid) {
        alert("Phone number must be numeric");
        setParInfo({ ...parInfo, phoneNumber: "" });
        return;
      }
      if (parInfo.name.length < 3) {
        alert("Name must be at least 3 characters");
        setParInfo({ ...parInfo, name: "" });
        return;
      }
      if (parInfo.phoneNumber.length > 15) {
        alert("Phone number must be at most 15 characters");
        setParInfo({ ...parInfo, phoneNumber: "" });
        return;
      }
      if (authPar.email.length < 6) {
        alert("Email must be at least 6 characters");
        setAuthPar({ ...authPar, email: "" });
        return;
      }
      if (authPar.email.length > 50) {
        alert("Email must be at most 50 characters");
        setAuthPar({ ...authPar, email: "" });
        return;
      }
      if (parInfo.name.length > 50) {
        alert("Name must be at most 50 characters");
        setParInfo({ ...parInfo, name: "" });
        return;
      }

      const result = await addParent({
        email: authPar.email,
        password: authPar.password,
        role: authPar.role,
        name: parInfo.name,
        address: parInfo.address,
        phoneNumber: parInfo.phoneNumber,
      });
      console.log(result);
      alert("Parent added successfully");
      setAuthPar({ email: "", password: "", role: "parent" });
      setParInfo({ name: "", address: "", phoneNumber: "" });
    } catch (error) {
      console.log(error);
      alert("Failed to add parent");
    }
  };

  useEffect(() => {
    const queryParent = query(collection(db, "parent"));

    const unsubscribe = onSnapshot(
      queryParent,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setParents(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Parent&apos;s List</h1>
      <ul>
        {parents.map((parent) => (
          <li key={parent.id}>
            {parent.name} - {parent.address} - {parent.phoneNumber}
            <button onClick={(e) => handleModifyParent(e, parent.id)}>
              Modify
            </button>
            <button onClick={(e) => handleDeleteParent(e, parent.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isModifyFormOpen && (
        <ModifyParentForm
          parentId={currentParentId}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}

      <h1>Add Parent</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Email</label>
        <input
          type="text"
          value={authPar.email}
          onChange={(e) => setAuthPar({ ...authPar, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={authPar.password}
          onChange={(e) => setAuthPar({ ...authPar, password: e.target.value })}
        />
        <label>Name</label>
        <input
          type="text"
          value={parInfo.name}
          onChange={(e) => setParInfo({ ...parInfo, name: e.target.value })}
        />
        <label>Address</label>
        <input
          type="text"
          value={parInfo.address}
          onChange={(e) => setParInfo({ ...parInfo, address: e.target.value })}
        />
        <label>Phone Number</label>
        <input
          type="text"
          value={parInfo.phone}
          onChange={(e) =>
            setParInfo({ ...parInfo, phoneNumber: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
