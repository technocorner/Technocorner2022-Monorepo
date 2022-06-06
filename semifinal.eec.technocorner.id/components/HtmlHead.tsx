import Head from "next/head";

interface HeadProps {
  title: string;
  description: string;
}

export default function HtmlHead({ title, description }: HeadProps) {
  return (
    <Head>
      <title>{`${title} · Semifinal EEC Technocorner 2022`}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
