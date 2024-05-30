import { NavLink } from "react-router-dom";
import Logo from "../../assets/LOGO.png";
import UserProfile from "../account/userProfile";

export default function HeaderAdmin() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-red-500" : "text-white";

  return (
    <header className="bg-uit h-[70px] text-white flex items-center justify-between p-2 fixed top-0 left-0 right-0">
      <div className="flex items-center">
        <div className="ml-2 mr-8 w-16">
          <NavLink to="/admin">
            <img src={Logo} alt="LOGO" />
          </NavLink>
        </div>
        <div className="flex flex-col text-white text-xs lg:text-base font-bold text-center uppercase mr-2">
          <div>Hệ thống quản lý</div>
          <div>sinh viên</div>
        </div>
      </div>
      <nav className="text-white flex flex-row items-center text-xs lg:text-base font-bold space-x-12">
        <NavLink to="/admin/manageDevice" className={navLinkClass}>
          Thiết bị
        </NavLink>
        <NavLink to="/admin/manageLecturer" className={navLinkClass}>
          Giáo viên
        </NavLink>
        <NavLink to="/admin/manageStudent" className={navLinkClass}>
          Sinh viên
        </NavLink>
        <NavLink to="/admin/manageParent" className={navLinkClass}>
          Phụ huynh
        </NavLink>
        <NavLink to="/admin/manageCourse" className={navLinkClass}>
          Môn học
        </NavLink>
        <NavLink to="/admin/manageRoom" className={navLinkClass}>
          Phòng học
        </NavLink>
      </nav>
      <div className="ml-6 mr-12">
        <NavLink to="/admin">
          <UserProfile />
        </NavLink>
      </div>
    </header>
  );
}
