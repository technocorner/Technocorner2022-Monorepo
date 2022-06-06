export default function SafeArea(props: { children: JSX.Element }) {
  return (
    <div className="min-h-screen mt-6 lg:mt-0 lg:ml-[20.625rem] py-10 px-7 flex flex-col">
      {props.children}
      <img
        className="fixed z-[-1] right-0 bottom-0 h-[69%]"
        src="/assets/main/mask.svg"
        alt=""
      />
    </div>
  );
}
