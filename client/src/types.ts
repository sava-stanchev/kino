export interface Movie {
  id: number,
  title: string,
  desc: string,
  posterUrl: string;
}

export interface User {
  id: number;
  username: string;
  is_admin: number;
  iat: number; // Issued at time
  exp: number; // Expiration time
}

export interface ListedUser {
  id: number;
  username: string;
  email: string;
  is_admin: number;
  is_deleted: number;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  cover: string;
  author: string;
  avg_rating: number;
  description: string;
  genre: number;
  is_deleted: number;
  language: number;
  num_ratings: number;
  year: number;
}

export interface Review {
  id: number;
  username: string;
  date_created: string;
  content: string;
  user_id: number;
}

export interface AlertDismissibleProps {
  active: boolean;
  message?: string;
}

export interface StarRatingProps {
  value: number | null;
  rating: number | null;
  setRating: (rating: number) => void;
  numRatings: number | null;
  setNumRatings: (numRatings: number) => void;
  id: string;
  user: User;
  disabled: boolean;
  setUserBookRating: (rating: number) => void;
}
