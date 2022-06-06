import Head from "next/head";

export default function HtmlHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{`${title} · Penyisihan EEC Technocorner 2022`}</title>
      <meta
        name="description"
        content={`${title} Penyisihan EEC Technocorner 2022`}
      />
    </Head>
  );
}
