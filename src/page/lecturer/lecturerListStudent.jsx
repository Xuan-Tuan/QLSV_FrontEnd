import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { doGetStudentInfoLecturer } from "../../controller/firestoreController";

LecListStudentPage.propTypes = {
  studentList: PropTypes.array.isRequired,
  courseCode: PropTypes.string.isRequired,
};

export default function LecListStudentPage({ studentList, courseCode }) {
  const [studentInfo, setStudentInfo] = useState([]);
  useEffect(() => {
    const studentName = async () => {
      console.log("studentList: ", studentList);
      const studentListName = await doGetStudentInfoLecturer(
        studentList,
        courseCode
      );
      console.log(studentListName);
      setStudentInfo(studentListName);
    };
    studentName();
  }, [studentList, courseCode]);

  return (
    <div>
      <h1>Student&apos;s List</h1>
      {studentInfo ? (
        studentInfo.map((student) => (
          <div key={student.id}>
            <p>
              {student.name} - {student.attended}/{student.total}{" "}
            </p>
          </div>
        ))
      ) : (
        <p>No student</p>
      )}
    </div>
  );
}
