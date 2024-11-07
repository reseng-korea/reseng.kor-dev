import React from 'react';
import { motion } from 'framer-motion';

import leaf from '../../assets/main5_leaf.png';
import earth from '../../assets/main5_earth.png';
import recycle from '../../assets/main5_recycle.png';
import recycle2 from '../../assets/main5_recycle2.png';
import sparkle1 from '../../assets/main5_sparkle1.png';
import sparkle2 from '../../assets/main5_sparkle2.png';
import sparkle3 from '../../assets/main5_sparkle3.png';
import sparkle4 from '../../assets/main5_sparkle4.png';
import sparkle5 from '../../assets/main5_sparkle5.png';
import sparkle6 from '../../assets/main5_sparkle6.png';
import sun from '../../assets/main5_sun.png';
import sun2 from '../../assets/main5_sun2.png';
import sun3 from '../../assets/main5_sun3.png';

const MainFifthPage = () => {
  // 애니메이션 variants 설정
  const bounceVariant = {
    hidden: { opacity: 1, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const rotateVariant = {
    hidden: { opacity: 1, rotate: -45 },
    visible: { opacity: 1, rotate: 0 },
  };

  const zoomVariant = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1 },
  };

  const slideUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-full bg-[#F4F1EA] bg-cover bg-center">
      {/* Sparkles */}
      <motion.img
        src={sparkle4}
        className="absolute top-28 left-56 w-16 h-16"
        variants={bounceVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.img
        src={sparkle4}
        className="absolute bottom-12 right-56 w-16 h-16"
        variants={rotateVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.img
        src={sparkle5}
        className="absolute top-32 right-64 w-16 h-16"
        variants={bounceVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.img
        src={sparkle5}
        className="absolute top-[400px] left-24 w-18 h-16"
        variants={rotateVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.img
        src={sparkle6}
        className="absolute bottom-16 left-[520px] w-12 h-12"
        variants={bounceVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.img
        src={sparkle6}
        className="absolute top-[360px] right-20 w-12 h-12"
        variants={rotateVariant}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* 텍스트와 메인 이미지 */}
      <div className="flex flex-col">
        <div className="flex py-2 justify-center items-center space-x-4">
          <motion.span
            className="text-4xl sm:text-4xl md:text-7xl text-[#264d3b] font-bold"
            variants={slideUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            리앤생은
          </motion.span>

          <motion.img
            src={leaf}
            className="w-32 h-32"
            variants={zoomVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex py-2 justify-center items-center space-x-8">
          <motion.span
            className="text-4xl sm:text-4xl md:text-7xl text-[#264d3b] font-bold"
            variants={slideUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 2 }}
          >
            지구와
          </motion.span>

          <motion.img
            src={earth}
            className="w-28 h-28"
            variants={zoomVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.span
            className="text-4xl sm:text-4xl md:text-7xl text-[#264d3b] font-bold"
            variants={slideUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 2 }}
          >
            함께하는
          </motion.span>
        </div>

        <div className="flex py-2 justify-center items-center space-x-8">
          <motion.span
            className="text-4xl sm:text-4xl md:text-7xl text-[#264d3b] font-bold"
            variants={slideUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            지속 가능한 미래를
          </motion.span>

          <motion.img
            src={sun3}
            className="w-24 h-24"
            variants={zoomVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          <motion.span
            className="text-4xl sm:text-4xl md:text-7xl text-[#264d3b] font-bold"
            variants={slideUpVariant}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            만듭니다.
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default MainFifthPage;
