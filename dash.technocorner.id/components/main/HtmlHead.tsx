import Head from "next/head";

export default function HtmlHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{`${title} · Dashboard Technocorner`}</title>
      <meta name="description" content={`${title} Dashboard Technocorner`} />
    </Head>
  );
}
