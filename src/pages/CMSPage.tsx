import { motion } from 'motion/react';

import BusinessOperationsCMS from '../components/BusinessOperationsCMS';

export default function CMSPage() {
  return (
    <motion.div
      id="cms-root-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BusinessOperationsCMS />
    </motion.div>
  );
}
