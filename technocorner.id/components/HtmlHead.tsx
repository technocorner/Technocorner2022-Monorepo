import Head from "next/head";

interface HeadProps {
  title: string;
  description: string;
}

export default function HtmlHead({ title, description }: HeadProps) {
  return (
    <Head>
      <title>{`${title} · Technocorner`}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
