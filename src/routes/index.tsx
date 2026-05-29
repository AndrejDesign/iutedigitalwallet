import { createFileRoute } from "@tanstack/react-router";
import { IuteApp } from "@/components/iute/IuteApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyIute Pay — Social-first Wallet" },
      { name: "description", content: "Interactive prototype of MyIute Pay, a Gen-Z digital wallet for North Macedonia." },
      { property: "og:title", content: "MyIute Pay — Social-first Digital Wallet" },
      { property: "og:description", content: "Gen-Z digital wallet for North Macedonia. Send cash like a DM, split bills, and build streaks." },
      { property: "og:url", content: "https://iutedigitalwallet.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://iutedigitalwallet.lovable.app/" },
    ],
  }),
  component: Index,
});

function Index() {
  return <IuteApp />;
}
