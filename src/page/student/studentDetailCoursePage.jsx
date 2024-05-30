import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doGetCourseDetail,
  doGetScheduleFromCourseID,
  doGetAttendStatusFromStudentID,
} from "../../controller/firestoreController";
import { formattedDate } from "../../controller/formattedDate";
import { useAuth } from "../../controller/authController";

const currentDay = formattedDate(new Date("2024-09-08"));

export default function StudentDetailCoursePage() {
  const { courseCode } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    attended: 0,
    total: 0,
  });

  useEffect(() => {
    const getCourseDetail = async () => {
      const courseDetail = await doGetCourseDetail(courseCode);
      setCourse(courseDetail);
    };
    const getSchedule = async () => {
      const schedule = await doGetScheduleFromCourseID(courseCode, currentDay);
      // console.log(schedule);
      setSchedule(schedule);
    };
    const getAttendanceStats = async () => {
      const attendanceStats = await doGetAttendStatusFromStudentID(
        currentUser.uid,
        courseCode
      );
      setAttendanceStats(attendanceStats);
    };

    getAttendanceStats();
    getCourseDetail();
    getSchedule();
  }, [courseCode]);

  return (
    <div className="h-[calc(100vh-70px-50px)] flex flex-row justify-evenly ">
      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-lg text-uit font-semibold text-center">
          Môn học: {course.name}
        </h2>
        <div className="flex  items-center justify-center border border-uit rounded-lg shadow-lg px-6 py-6 min-w-80 min-h-80 lg:min-w-96 lg:min-h-96">
          <div className="flex flex-col space-y-4">
            <div>
              <span className="font-semibold">Giáo viên:</span>{" "}
              {course.lecturerName}
            </div>
            <div>
              <span className="font-semibold">Ngày bắt đầu:</span>{" "}
              {course.startDay}
            </div>
            <div>
              <span className="font-semibold">Tuần Học:</span> {course.week}{" "}
              Tuần
            </div>
            <div>
              <span className="font-semibold">Phòng học:</span> {course.roomID}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center space-y-6 mt-8">
        <h2 className="text-lg text-uit font-semibold text-center">
          Thông tin lịch học hôm nay: {currentDay}
        </h2>
        <div className="flex  items-center justify-center border border-uit rounded-lg shadow-lg px-6 py-6 min-w-80 min-h-80 lg:min-w-96 lg:min-h-96 ">
          <div className="flex flex-col space-y-4">
            {schedule.length === 0 ? (
              <div>Không có lịch học</div>
            ) : (
              <div key={schedule[0].id}>
                <div>
                  <span className="font-semibold">Online URL:</span>{" "}
                  {course.onlineURL}
                </div>
                <div>
                  <span className="font-semibold">Thời gian bắt đầu:</span>{" "}
                  {schedule[0].startTime}
                </div>
                <div>
                  <span className="font-semibold">Thời gian kết thúc:</span>{" "}
                  {schedule[0].endTime}
                </div>
                <div>
                  <span className="font-semibold">Ngày học:</span>{" "}
                  {schedule[0].date}
                </div>
              </div>
            )}

            <div>
              <span className="font-semibold">Trạng thái điểm danh:</span>{" "}
              {attendanceStats.attended}/{attendanceStats.total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
