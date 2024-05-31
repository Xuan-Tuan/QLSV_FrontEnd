import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { onSnapshot, collection, where, query, doc } from "firebase/firestore";
import { doUpdateCourseOnlineLink } from "../../controller/firestoreController";
import LecListStudentPage from "./lecturerListStudent";
import { formattedDate } from "../../controller/formattedDate";
import { FiEdit } from "react-icons/fi";
import {
  doGetScheduleFromCourseID,
  getStudentCount,
  getAttendedStudentCount,
  getScheduleToday,
} from "../../controller/firestoreController";

const currentDay = formattedDate(new Date("2024-09-08"));
export default function LecturerDetailCoursePage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [attendanceStatsOfClass, setAttendanceStatsOfClass] = useState({
    attended: 0,
    total: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  const [onlineURL, setOnlineURL] = useState("");
  const [studentList, setStudentList] = useState([]);

  const handleOnlineLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await doUpdateCourseOnlineLink(courseCode, onlineURL);
      console.log("Add online link success");
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddLinkOnline = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleViewAttendance = (e) => {
    e.preventDefault();
    setShowAttendance(true);
  };
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowAttendance(false);
    }
  };
  useEffect(() => {
    const queryCourse = query(doc(db, "course", courseCode));

    const unsubscribeCourse = onSnapshot(queryCourse, (snapshot) => {
      setCourse(snapshot.data());
    });

    const queryCourseStudent = query(
      collection(db, "courseStudent"),
      where("courseID", "==", courseCode)
    );

    const unsubscribeCourseStudent = onSnapshot(
      queryCourseStudent,
      (snapshot) => {
        let studentList = [];
        snapshot.docs.forEach((doc) => {
          studentList.push(doc.data().studentID);
        });

        setStudentList(studentList);
      }
    );

    const getSchedule = async () => {
      const schedule = await doGetScheduleFromCourseID(courseCode, currentDay);
      setSchedule(schedule);
    };

    const getClassSchedule = async () => {
      try {
        const total = await getStudentCount(courseCode);
        const UidSchedule = await getScheduleToday(courseCode, currentDay);
        const attended = await getAttendedStudentCount(UidSchedule);
        setAttendanceStatsOfClass({ attended, total }); // Cập nhật state với cả attended và total
      } catch (error) {
        console.error("Failed to get class schedule: ", error);
      }
    };

    return () => {
      getClassSchedule();
      getSchedule();
      unsubscribeCourse();
      unsubscribeCourseStudent();
    };
  }, [courseCode]);

  return (
    <div className="h-[calc(100vh-70px-50px)] flex flex-col lg:flex-row justify-evenly p-8 bg-gray-50">
      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold text-center">
          Môn học: {course.name}
        </h2>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            <div className="flex justify-between ">
              <span className="font-semibold mr-6">Mã môn học:</span>
              <span>{course.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold mr-6">Ngày bắt đầu:</span>
              <span>{course.startDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold mr-6">Tuần học:</span>
              <span>{course.week} Tuần</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold mr-6">Phòng học:</span>
              <span>{course.roomID}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold text-center">
          Thông tin lịch dạy hôm nay: {currentDay}
        </h2>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            {schedule.length === 0 ? (
              <div>Không có lịch dạy</div>
            ) : (
              <div>
                <div className="flex justify-between space-x-4">
                  <span className="font-semibold">Online URL:</span>
                  <span>{course.onlineURL}</span>
                  <FiEdit
                    className="border-2 rounded-md text-uit cursor-pointer transform transition-transform duration-300 hover:scale-110"
                    size={30}
                    onClick={(e) => handleAddLinkOnline(e)}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Thời gian bắt đầu:</span>
                  <span className="">{schedule[0].startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Thời gian kết thúc:</span>
                  <span>{schedule[0].endTime}</span>
                </div>
              </div>
            )}
            <div
              className="flex justify-between border border-uit bg-white rounded-lg shadow-lg p-4 font-semibold cursor-pointer transform transition-transform duration-300 hover:scale-110"
              onClick={(e) => handleViewAttendance(e)}
            >
              <span>Trạng thái điểm danh:</span>
              <span className="font-semibold">
                <span className="text-green-500">
                  {attendanceStatsOfClass.attended}
                </span>
                <span>/</span>
                <span className="text-red-500">
                  {attendanceStatsOfClass.total}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-300 w-96 text-uit">
            <h2 className="text-xl font-bold mb-4">Thêm Thông Báo</h2>
            <form onSubmit={(e) => handleOnlineLinkSubmit(e)}>
              <label className="block mb-2 font-semibold">Link</label>
              <input
                type="text"
                placeholder="Online Link"
                onChange={(e) => setOnlineURL(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded mb-4 shadow-sm"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                >
                  Thêm link
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAttendance && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-300 w-auto text-uit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xl font-bold mb-4 text-center">
              {`Danh sách sinh viên học lớp ${courseCode}`}
            </div>
            {course ? (
              <LecListStudentPage
                studentList={studentList}
                courseCode={courseCode}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
