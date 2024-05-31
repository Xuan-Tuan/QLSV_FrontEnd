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
      const studentListName = await doGetStudentInfoLecturer(
        studentList,
        courseCode
      );

      setStudentInfo(studentListName);
    };
    studentName();
  }, [studentList, courseCode]);

  return (
    <div className="flex justify-center my-8">
      {studentInfo ? (
        <div className="overflow-x-auto">
          <table className="min-w-full md:w-3/4 table-auto shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">STT</th>
                <th className="px-4 py-2">Họ tên</th>
                <th className="px-4 py-2">Địa Chỉ</th>
                <th className="px-4 py-2">Điểm Danh</th>
              </tr>
            </thead>
            <tbody>
              {studentInfo.map((student, index) => (
                <tr
                  key={student.id}
                  className="bg-white hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.address}</td>
                  <td className="border px-4 py-2">
                    {student.attended}/{student.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Không tìm thấy sinh viên nào</p>
      )}
    </div>
  );
}
