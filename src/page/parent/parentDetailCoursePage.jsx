import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doGetCourseDetail,
  doGetScheduleFromCourseID,
  doGetAttendStatusFromStudentID,
  doGetStudentFromParent,
} from "../../controller/firestoreController";
import { formattedDate } from "../../controller/formattedDate";
import { useAuth } from "../../controller/authController";

const currentDay = formattedDate(new Date("2024-09-08"));

export default function ParentDetailCoursePage() {
  const { courseCode } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    attended: 0,
    total: 0,
  });

  useEffect(() => {
    const getStudentList = async () => {
      const studentListFC = await doGetStudentFromParent(currentUser.uid);
      setStudentList(studentListFC);

      if (studentListFC.length > 0) {
        getAttendanceStats(studentListFC[0].id);
      }
    };

    const getCourseDetail = async () => {
      const courseDetail = await doGetCourseDetail(courseCode);
      setCourse(courseDetail);
    };
    const getSchedule = async () => {
      const schedule = await doGetScheduleFromCourseID(courseCode, currentDay);
      setSchedule(schedule);
    };
    const getAttendanceStats = async (studentID) => {
      const attendanceStats = await doGetAttendStatusFromStudentID(
        studentID,
        courseCode
      );
      setAttendanceStats(attendanceStats);
    };

    if (currentUser) {
      getStudentList();
      getCourseDetail();
      getSchedule();
    }
  }, [courseCode, currentUser, studentList]);

  return (
    <div className="h-[calc(100vh-70px-50px)] flex flex-col lg:flex-row justify-evenly p-8 bg-gray-50">
      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold text-center">
          Môn học: {course.name}
        </h2>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            <div className="flex justify-between">
              <span className="font-semibold">Giáo viên:</span>
              <span>{course.lecturerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ngày bắt đầu:</span>
              <span>{course.startDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Tuần học:</span>
              <span>{course.week} Tuần</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phòng học:</span>
              <span>{course.roomID}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-2xl text-uit font-semibold text-center">
          Thông tin lịch học hôm nay: {currentDay}
        </h2>
        <div className="flex items-center justify-center border border-uit bg-white rounded-lg shadow-lg px-8 py-6 w-full lg:w-96">
          <div className="flex flex-col space-y-4 text-uit text-lg">
            {schedule.length === 0 ? (
              <div>Không có lịch học</div>
            ) : (
              <div key={schedule[0].id}>
                <div className="flex justify-between">
                  <span className="font-semibold">Online URL:</span>
                  <span>{course.onlineURL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Thời gian bắt đầu:</span>
                  <span>{schedule[0].startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Thời gian kết thúc:</span>
                  <span>{schedule[0].endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Ngày học:</span>
                  <span>{schedule[0].date}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">Trạng thái điểm danh:</span>
              <span>
                {attendanceStats.attended}/{attendanceStats.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
