export interface Group {
  _id: number;
  name: string;
  private: boolean;
  owner: number;
  users: {
    userId: number[];
  };
}
