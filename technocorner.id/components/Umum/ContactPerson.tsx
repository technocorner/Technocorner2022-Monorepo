import lineicon from "../../public/images/Competitions/line-cp-icon.svg";
import waicon from "../../public/images/Competitions/wa-cp-icon.svg";
import Image from "next/image";
import { dataCP } from "../../data/dataCP";

export default function ContactPerson(props: any) {
  const item = dataCP.filter((items) => items.name == props.name);

  return (
    <>
      <div
        data-aos="fade-right"
        className="overflow-x-hidden content-around bg-cstmwhite px-4 md:px-24 lg:px-36 pt-12 md:pt-16 xl:pt-20"
      >
        <div className="py-2 sm:py-3 md:py-4">
          <div className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6">
            Contact Person
          </div>
          <div className="flex justify-center">
            <div
              className="space-y-2 mx-auto px-8 sm:px-32 md:px-40"
              key={item[0].id}
            >
              <div className="flex gap-2 w-32 md:w-auto block m-auto">
                <Image src={waicon} height={25} width={25} title="WhatsApp" />
                <a
                  className="text-left hover:underline"
                  href={`https://wa.me/${item[0].waCP}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {item[0].waCP} ({item[0].CP})
                </a>
              </div>
              {/* <div className="flex gap-2 w-32 md:w-auto block m-auto">
                <Image src={lineicon} height={25} width={25} />
                <div className="text-left">{item[0].lineCP}</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
