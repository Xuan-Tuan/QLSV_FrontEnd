import { NavLink } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";

export default function ToolBar() {
  return (
    <header className="bg-uitLight text-uit shadow-md flex items-center justify-center p-2 fixed top-0 right-0 left-52 h-20 w-auto border-l-2 bodder-white">
      <div className="flex flex-col text-uit text-base lg:text-xl font-bold text-center uppercase mr-2">
        <div>Hệ thống quản lý</div>
        <div>sinh viên</div>
      </div>
      <div className="fixed right-10 text-uit">
        <NavLink to="/admin">
          <div className="flex flex-row items-center justify-between">
            <div className=" font-bold text-base mr-5">ADMIN</div>
            <RiAdminLine size={50} />
          </div>
        </NavLink>
      </div>
    </header>
  );
}
