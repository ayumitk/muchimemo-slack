import type { NextPage } from "next";
import Link from "next/link";

// json
import channels from "../data/channels.json";

// components
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout h1="Slackチャンネル" description="">
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link href={`channel/${channel.id}`}>
              <a className="border block my-2 p-6 sm:p-10 rounded-3xl text-md sm:text-xl hover:bg-gray-100">
                {channel.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Home;
