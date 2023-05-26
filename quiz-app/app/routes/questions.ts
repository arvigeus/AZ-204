import { json } from "@remix-run/node";
import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { data, topics } from "~/lib/qa";

export const meta: MetaFunction = () => {
  return [{ title: "Developing Solutions for Microsoft Azure: Quiz" }];
};

export let loader = async () => {
  return json({ questions: data, topics });
};
