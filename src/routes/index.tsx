import { createFileRoute } from "@tanstack/react-router";
import { IuteApp } from "@/components/iute/IuteApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyIute Pay — Social-first Wallet" },
      { name: "description", content: "Interactive prototype of MyIute Pay, a Gen-Z digital wallet for North Macedonia." },
      { property: "og:title", content: "MyIute Pay" },
      { property: "og:description", content: "Send cash like a DM. Split bills, build streaks, shake to freeze." },
    ],
  }),
  component: Index,
});

function Index() {
  return <IuteApp />;
}
