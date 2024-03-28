import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { data, topics } from "~/lib/qa";

export const meta: MetaFunction = () => {
  return [{ title: "Developing Solutions for Microsoft Azure: Quiz" }];
};

export const loader = async () => {
  return json({ questions: data, topics });
};
