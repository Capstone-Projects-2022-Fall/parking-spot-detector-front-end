export interface Parking {
  registration_id: string;
  coordinates: number[];
  orientation: number;
  parkingAval: boolean;
}

export const initialState: Parking = {
  registration_id: "",
  coordinates: [0.0, 0.0],
  orientation: 0,
  parkingAval: false,
};
