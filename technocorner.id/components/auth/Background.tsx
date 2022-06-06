export default function Background() {
  return (
    <div className="w-screen h-screen fixed bg-[#010706] overflow-hidden">
      <div
        className="w-[47%] h-0 pb-[47%] fixed right-0 transform-gpu"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(11,140,117,0.3) 0%, transparent 65%)",
        }}
      />
      <div
        className="w-[87%] h-0 pb-[87%] fixed top-[21%] left-[21%] rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle at center, rgba(17,138,178,0.3) 0%, transparent 70%)",
        }}
      />
      <div
        className="w-[47%] h-0 pb-[47%] fixed bottom-0 right-0 transform-gpu"
        style={{
          background:
            "radial-gradient(circle at right bottom, rgba(16,131,168,0.3) 0%, transparent 70%)",
        }}
      />
      <div
        className="w-[47%] h-0 pb-[47%] fixed bg-[#0B8C75] transform-gpu"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(11,140,117,0.3) 0%, transparent 65%)",
        }}
      />
      <div
        className="w-[12%] h-0 pb-[12%] fixed top-[50%] left-[79%] rounded-full transform-gpu blur-[6px] rotate-[-15deg]"
        style={{
          background:
            "linear-gradient(180deg,rgba(4,191,173,0.7)0%,rgba(11,140,117,0.7)13%,rgba(2,15,13,0.7)44%)",
        }}
      />
      <div
        className="w-[58%] h-0 pb-[58%] fixed top-[55%] left-[45%] rounded-full transform-gpu rotate-[-15deg]"
        style={{
          background:
            "linear-gradient(180deg,#118AB2 0%,#0A4F63 16%,#031311 35%)",
        }}
      />
      <img
        className="w-[5%] h-0 pb-[5%] fixed top-[53%] left-[25%] transform-gpu"
        src="/assets/auth/ellipse107.svg"
        alt=""
      />
      <img
        className="w-[2%] h-0 pb-[2%] fixed top-[44%] left-[64%] transform-gpu"
        src="/assets/auth/ellipse112.svg"
        alt=""
      />
      <img
        className="w-[2%] h-0 pb-[2%] fixed top-[79%] left-[34%] transform-gpu"
        src="/assets/auth/ellipse108.svg"
        alt=""
      />
      <img
        className="w-[1%] h-0 pb-[1%] fixed top-[85%] left-[32%] transform-gpu"
        src="/assets/auth/ellipse110.svg"
        alt=""
      />
      <img
        className="w-[3%] h-0 pb-[3%] fixed top-[25%] left-[67%] transform-gpu"
        src="/assets/auth/ellipse109.svg"
        alt=""
      />
      <img
        className="w-[39%] fixed transform-gpu"
        src="/assets/auth/net.svg"
        alt=""
      />
    </div>
  );
}
