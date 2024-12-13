package internal

type RouteCreatedEvent struct {
	EventName  string       `json:"event"`
	RouteId    string       `json:"id"`
	Distance   int          `json:"distance"`
	Directions []Directions `json:"directions"`
}

func NewRouteCreatedEvent(routeId string, distance int, directions []Directions) *RouteCreatedEvent {
	return &RouteCreatedEvent{
		EventName:  "RouteCreated",
		RouteId:    routeId,
		Distance:   distance,
		Directions: directions,
	}
}

type FreightCalculatedEvent struct {
	EventName string  `json:"event"`
	RouteId   string  `json:"route_id"`
	Amount    float64 `json:"amount"`
}

func NewFreightCalculatedEvent(routeId string, amount float64) *FreightCalculatedEvent {
	return &FreightCalculatedEvent{
		EventName: "FreightCalculated",
		RouteId:   routeId,
		Amount:    amount,
	}
}

type DeliveryStartedEvent struct {
	EventName string `json:"event"`
	RouteId   string `json:"route_id"`
}

func NewDeliveryStartedEvent(routeId string) *DeliveryStartedEvent {
	return &DeliveryStartedEvent{
		EventName: "DeliveryStarted",
		RouteId:   routeId,
	}
}

type DriverMovedEvent struct {
	EventName string  `json:"event"`
	RouteId   string  `json:"route_id"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
}

func NewDriverMovedEvent(routeId string, lat, lng float64) *DriverMovedEvent {
	return &DriverMovedEvent{
		EventName: "DriverMoved",
		RouteId:   routeId,
		Lat:       lat,
		Lng:       lng,
	}
}

func RouteCreatedHandler(event *RouteCreatedEvent, routeService *RouteService) (*FreightCalculatedEvent, error) {
	route := NewRoute(event.RouteId, event.Distance, event.Directions)
	routeCreated, err := routeService.CreateRoute(route)
	if err != nil {
		return nil, err
	}

	freightCalcutatedEvent := NewFreightCalculatedEvent(routeCreated.ID, routeCreated.FreightPrice)
	return freightCalcutatedEvent, nil
}
