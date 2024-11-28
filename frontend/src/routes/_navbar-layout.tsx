import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/ui/navbar";

export const Route = createFileRoute("/_navbar-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
