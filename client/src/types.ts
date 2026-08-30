export interface MovieResponse {
    id: number;
    title: string;
    desc: string;
    posterUrl: string;
}

export interface MovieDetailResponse {
    id: number;
    title: string;
    desc: string;
    posterUrl: string;
    releaseDate: string | null;
    runtime: number | null;
    lang: string;
}

export interface User {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

export interface ListedUser {
  id: number;
  username: string;
  email: string;
  is_admin: number;
  is_deleted: number;
  password: string;
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
    msg?: string;
    onClose?: () => void;
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
