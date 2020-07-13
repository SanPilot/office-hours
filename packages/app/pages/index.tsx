import { User } from "@template/common";
import Router from "next/router";
import { useProfile } from "../hooks/useProfile";

export default function Home() {
  const profile: User = useProfile();

  if (profile) {
    Router.push(
      "/class/[cid]/today",
      "/class/" + profile.courses[0].course.id + "/today"
    );
  }

  return "insert loading circle here";
}
