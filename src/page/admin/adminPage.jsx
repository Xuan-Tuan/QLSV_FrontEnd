import HeaderAdmin from "../../component/header/headerAdmin";
import Footer from "../../component/footer/footer";
import PropTypes from "prop-types";

AdminPage.propTypes = {
  children: PropTypes.object,
};

export default function AdminPage({ children }) {
  return (
    <>
      <HeaderAdmin />
      <div className="mt-[70px] mb-[50px]">{children}</div>
      <Footer />
    </>
  );
}
