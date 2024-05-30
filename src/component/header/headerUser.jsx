import Logo from "../../assets/LOGO.png";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserProfile from "../account/userProfile";
import { useAuth } from "../../controller/authController";

export default function HeaderUser() {
  const { currentUser } = useAuth();
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-red-500" : "text-white";
  const [role, setRole] = useState();

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        const { role } = idTokenResult.claims;
        setRole(role);
      });
    }
  }, [currentUser]);

  return (
    <header className="bg-uit h-[70px] text-white flex items-center justify-between p-2">
      <div className="flex items-center">
        <div className="ml-2 mr-8 w-16">
          <NavLink to={`/${role}`}>
            <img src={Logo} alt="LOGO" />
          </NavLink>
        </div>
        <div className="flex flex-col text-while text-xs lg:text-base font-bold text-center uppercase mr-2">
          <div>Hệ thống quản lý</div>
          <div>sinh viên</div>
        </div>
      </div>
      <div className="flex items-center">
        <nav className="text-white flex flex-row items-center justify-between text-xs lg:text-base font-bold space-x-12">
          <NavLink to={`/${role}/course`} className={navLinkClass} key="course">
            Môn học
          </NavLink>
        </nav>
      </div>
      <span className="flex items-center justify-between mx-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="rounded-full pl-4 pr-8 py-1 text-black"
            aria-label="Tìm kiếm"
          />
        </div>
        <div className="ml-6 mr-12">
          <NavLink to={`/${role}`}>
            <UserProfile />
          </NavLink>
        </div>
      </span>
    </header>
  );
}
