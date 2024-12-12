import { RouteModel } from "@/types/models";
import { MapDriver } from "@/components/MapDriver";
import { BASE_URL } from "@/api/api";

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


export async function DriverPage({ searchParams }: { searchParams: Promise<{ route_id: string }> }) {
  const routes = await getRoutes();
  const { route_id } = await searchParams;

  let startLocation = null
  let endLocation = null
  if (route_id) {
    const route = await getRoute(route_id);
    const leg = route.directions.routes[0].legs[0];
    startLocation = {
      lat: leg.start_location.lat,
      lng: leg.start_location.lng,
    }
    endLocation = {
      lat: leg.end_location.lat,
      lng: leg.end_location.lng,
    }
  }

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-2 h-full">
        <h4 className="text-3xl text-contrast mb-2">Inicie uma rota</h4>
        <div className="flex flex-col">
          <form className="flex flex-col space-y-4" method="get">
            <select name="route_id" className="mb-2 p-2 border rounded bg-default text-contrast">
              {routes.map((route: RouteModel) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
            <button
              className="bg-main text-primary p-2 rounded text-xl font-bold"
              style={{ width: "100%" }}
            >
              Iniciar a viagem
            </button>
          </form>
        </div>
      </div>
      <MapDriver route_id={route_id} startLocation={startLocation} endLocation={endLocation} />
    </div>
  );
}

export default DriverPage;