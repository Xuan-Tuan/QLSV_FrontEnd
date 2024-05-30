import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { doDeleteStudent } from "../../controller/firestoreController";
import axiosInstance from "../../controller/axiosInstance";
import ModifyStudentForm from "./modifyForm/modifyStudentForm";

StudentListComponent.propTypes = {
  students: PropTypes.array,
  parents: PropTypes.array,
};

export default function StudentListComponent({ students, parents }) {
  const [studentList, setStudentList] = useState([]);
  const [parentList, setParentList] = useState([]);

  const [currentStudentId, setCurrentStudentId] = useState("");
  const [isModifyFormOpen, setIsModifyFormOpen] = useState(false);

  const deleteStudent = async (id) => {
    const response = await axiosInstance.post("/deleteStudent", { id });
    return response;
  };

  const handleModifyStudent = async (e, id) => {
    e.preventDefault();
    setCurrentStudentId(id);
    setIsModifyFormOpen(true);
  };

  const handleDeleteStudent = async (e, id, parentID) => {
    e.preventDefault();
    try {
      await doDeleteStudent(id, parentID);
      const result = await deleteStudent(id);
      console.log(result);
      alert("Student deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete student");
    }
  };

  useEffect(() => {
    setStudentList(students);
    setParentList(parents);
  }, [students, parents]);

  return (
    <div>
      {studentList.map((student) => (
        <p key={student.id}>
          {student.name} -{" "}
          {parentList.find((parent) => parent.id === student.parentID)?.name} -{" "}
          {student.address} - {student.phoneNumber}
          <button onClick={(e) => handleModifyStudent(e, student.id)}>
            Modify
          </button>
          <button
            onClick={(e) =>
              handleDeleteStudent(e, student.id, student.parentID)
            }
          >
            Delete
          </button>
        </p>
      ))}
      {isModifyFormOpen && (
        <ModifyStudentForm
          studentId={currentStudentId}
          parents={parentList}
          closeForm={() => setIsModifyFormOpen(false)}
        />
      )}
    </div>
  );
}
