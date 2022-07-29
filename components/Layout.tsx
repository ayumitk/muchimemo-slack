import Head from "next/head";

export default function Layout({
  children,
  h1,
  description,
}: {
  children: React.ReactNode;
  h1: string;
  description: string;
}) {
  return (
    <div className="text-gray-900">
      <Head>
        <title>旧Slackアーカイブ</title>
        <meta name="description" content="Discordに移行しました。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container max-w-screen-md mx-auto my-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4">
          {h1}
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600">
          <span
            dangerouslySetInnerHTML={{
              __html: description.replace(/\n/g, "<br />"),
            }}
          />
        </p>
      </header>

      <main className="container max-w-screen-md mx-auto my-10">
        <div className="mx-2">{children}</div>
      </main>
    </div>
  );
}
