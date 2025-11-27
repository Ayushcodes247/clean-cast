import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white font-[dmlight] text-lg tracking-wide font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;
