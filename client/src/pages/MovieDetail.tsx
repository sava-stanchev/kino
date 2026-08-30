import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
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

                const res = await fetch(`${SPRING}/api/movies/${id}`, {
					headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
				});
                
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
        <Container className="my-5 py-3">
            <Card bg="dark" border="secondary" className="shadow-lg text-light">
                <Row className="g-0">
                    <Col lg={4} className="d-flex align-items-center justify-content-center p-4 p-lg-5">
                        <Card.Img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="rounded shadow"
                        />
                    </Col>
                    <Col lg={8}>
                        <Card.Body className="h-100 d-flex flex-column justify-content-center p-4 p-lg-5">
                            <Card.Subtitle className="mb-2 text-uppercase text-primary fw-semibold">
                                Movie detail
                            </Card.Subtitle>
                            <Card.Title as="h1" className="display-5 fw-bold mb-4">
                                {movie.title}
                            </Card.Title>

                            <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
                                {movie.releaseDate && (
                                    <Badge bg="secondary" className="px-3 py-2">
                                        Released {movie.releaseDate}
                                    </Badge>
                                )}
                                {movie.runtime !== null && (
                                    <Badge bg="secondary" className="px-3 py-2">
                                        {movie.runtime} min
                                    </Badge>
                                )}
                                <Badge bg="primary" className="px-3 py-2">
                                    Language: {movie.lang}
                                </Badge>
                            </Stack>

                            <div className="border-start border-primary border-3 ps-3">
                                <Card.Text className="mov-desc lead mb-0">
                                    {movie.desc}
                                </Card.Text>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default MovieDetail;
