export default function Demo({ name }: { name: string }) {
  let branch = "";
  switch (name) {
    case "TP":
      branch = "Transporter";
      break;
    case "LF":
      branch = "Line Follower";
      break;
  }

  return (
    <div className="px-4 md:px-24 lg:px-64 pt-12 md:pt-16 xl:pt-20 bg-cstmwhite">
      <h2 className="mb-4 font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center">
        Demo {branch}
      </h2>
      <iframe
        className="w-full aspect-video"
        src={`https://link.technocorner.id/Demo${name}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
