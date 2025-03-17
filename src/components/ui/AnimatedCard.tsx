'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
