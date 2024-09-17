import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import React, { forwardRef } from "react";
import classNames from 'classnames';

const PlusButton = forwardRef(function PlusButton({ showFloatingMenu, setShowFloatingMenu }, ref) {
  return (
    <button
      ref={ref}
      className={classNames(
        "absolute right-6 rounded-full top-[-15.5px] bg-white active:text-gray-400",
        { "text-gray-400": showFloatingMenu, "text-gray-300": !showFloatingMenu }
      )}
      onClick={() => {
        setShowFloatingMenu(!showFloatingMenu);
      }}
    >
      <motion.div
        animate={{ rotate: showFloatingMenu ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <PlusCircle className="size-8 text-black text-opacity-[0.68]" strokeWidth={1} />
      </motion.div>
    </button>
  );
});

export default PlusButton;
