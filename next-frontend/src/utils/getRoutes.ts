import { BASE_URL } from "@/api/api";
import { RouteModel } from "@/types/models";

export async function getRoutes() {
  const response = await fetch(`${BASE_URL}/routes`, {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });
  //revalidate por demanda
  return response.json();
}

export async function getRoute(route_id: string): Promise<RouteModel> {
  const response = await fetch(`${BASE_URL}/routes/${route_id}`, {
    cache: "force-cache",
    next: {
      tags: [`routes-${route_id}`, "routes"],
    },
  });
  //revalidate por demanda
  return response.json();
}