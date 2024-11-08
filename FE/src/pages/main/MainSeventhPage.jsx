import { motion } from 'framer-motion';
import { useState } from 'react';

function MainSeventhPage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle Visibility
      </button>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hello, Framer Motion!
        </motion.div>
      )}
    </div>
  );
}

export default MainSeventhPage;
