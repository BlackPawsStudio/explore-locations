export const searchDefaultReturn = (type: string) => {
  switch (type) {
    case "all":
      return [
        {
          id: 248,
          name: "United States",
          type: "airports",
        },
        {
          id: 27166,
          name: "New York, NY-Dubai",
          type: "flying-route",
        },
        {
          id: 25741,
          name: "London-New York, NY",
          type: "flying-route",
        },
        {
          id: 181045,
          name: "London-Manchester",
          type: "driving-route",
        },
        {
          id: 99086,
          name: "San Francisco-Los Angeles",
          type: "driving-route",
        },
        {
          id: 287,
          name: "London Heathrow Airport",
          type: "airport",
        },
      ];
    case "airport":
      return [
        {
          id: 287,
          name: "London Heathow Airport",
          type: "airport",
        },
        {
          id: 335,
          name: "Dubai International Airport",
          type: "airport",
        },
        {
          id: 706,
          name: "John F. Kennedy International Airport",
          type: "airport",
        },
        {
          id: 1311,
          name: "San Francisco International Airport",
          type: "airport",
        },
        {
          id: 605,
          name: "Miami International Airport",
          type: "airport",
        },
      ];
    case "flying-route":
      return [
        {
          id: 25261,
          name: "Dubai - Los Angeles",
          type: "flying-route",
        },
        {
          id: 14726,
          name: "Tokyo - Paris",
          type: "flying-route",
        },
        {
          id: 13556,
          name: "Rome - Shanghai",
          type: "flying-route",
        },
        {
          id: 21293,
          name: "Singapore - Barcelona",
          type: "flying-route",
        },
        {
          id: 9793,
          name: "Frankfurt - Sao Paulo",
          type: "flying-route",
        },
      ];
    case "driving-route":
      return [
        {
          id: 111478,
          name: "Paris - Prague",
          type: "driving-route",
        },
        {
          id: 107449,
          name: "Bern - Vienna",
          type: "driving-route",
        },
        {
          id: 46087,
          name: "San Francisco - San Salvador",
          type: "driving-route",
        },
        {
          id: 61198,
          name: "Seattle - Vancouver",
          type: "driving-route",
        },
        {
          id: 124874,
          name: "Portland - Tijuana",
          type: "driving-route",
        },
      ];
    case 'airports':
      return [
        {
          id: 248,
          name: "United States",
          type: "airports",
        },
        {
          id: 247,
          name: "United Kingdom",
          type: "airports",
        },
        {
          id: 99,
          name: "France",
          type: "airports",
        },
        {
          id: 106,
          name: "Germany",
          type: "airports",
        },
        {
          id: 225,
          name: "Spain",
          type: "airports",
        },
      ];
    default:
      return [];
  }
};
