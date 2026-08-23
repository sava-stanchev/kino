import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SPRING } from "src/common/constants";
import Loader from "src/components/Loader";
import { MovieDetailResponse } from "src/types";

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setErr(null);

                const res = await fetch(`${SPRING}/api/movies/${id}`);
                if (res.status === 404)
                    throw new Error('movie not found');
                if (!res.ok)
                    throw new Error("unable to load movie");

                const data: MovieDetailResponse = await res.json();
                setMovie(data);
            } catch (e) {
                setErr(e instanceof Error ? e.message : "unable to load movie");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading)
        return <Container className="my-5"><Loader /></Container>;
    if (err)
        return <Container className="my-5"><p>{err}</p></Container>;
    if (!movie)
        return null;

    return (
        <Container className="my-5">
            <Row className="d-flex flex-lg-row flex-column">
                <div className="d-flex d-lg-block col-lg-4 pe-lg-5 justify-content-center my-3 mb-lg-0">
                    <img className="img-fluid border border-5" src={movie.posterUrl} alt={movie.title} />
                </div>
                <div className="col-lg-8 ps-lg-5 text-light">
                    <h1>{movie.title}</h1>
                    <h2>{movie.releaseDate ?? ""}</h2>
                    <p>{movie.runtime !== null ? `${movie.runtime}m` : ""}</p>
                    <p>Language: {movie.lang}</p>
                    <p className="mov-desc">{movie.desc}</p>
                </div>
            </Row>
        </Container>
    );
};

export default MovieDetail;
