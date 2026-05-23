export interface Experience {
  id: string;
  position: string;
  duration: {
    start: string;
    end?: string;
  };
  location: string;
  description?: string;
}
