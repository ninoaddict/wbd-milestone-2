import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/job")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /job!";
}
