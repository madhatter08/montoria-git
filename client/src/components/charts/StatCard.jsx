import { motion } from "framer-motion";
import PropTypes from "prop-types";

const StatCard = ({ name, icon: Icon, value, color, bgColor }) => {
  return (
    <motion.div
      className={`overflow-hidden shadow-lg rounded-xl border border-gray-400 ${bgColor} bg-opacity-90 backdrop-blur-md`}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-xl font-medium text-gray-900">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
};

StatCard.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default StatCard;
