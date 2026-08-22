import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Col, Row, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SPRING } from "src/common/constants";
import Loader from "src/components/Loader";
import Search from "src/components/Search";
import { Movie } from "src/types";

const Movies: React.FC = () => {
	const navigate = useNavigate();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState("");
	const perPage = 6;

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const res = await fetch(`${SPRING}/api/movies`, { method: "GET" });
				if (!res.ok)
					throw new Error(`Error: ${res.status}`);

				const data: Movie[] = await res.json();
				setMovies(data);
			} catch (err) {
				console.error("Failed to fetch movies:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchMovies();
	}, []);

	useEffect(() => { setPage(0); }, [search]);

	const filtered = movies.filter((mov) =>
		mov.title.toLowerCase().includes(search.toLowerCase()));
	const pageMovies = filtered.slice(page * perPage, (page + 1) * perPage);
	const pageCnt = Math.ceil(filtered.length / perPage);

	return (
		<Container className="my-5">
		<Search search={search} onSearchChange={setSearch} />
		{loading ? (
			<Loader />
		) : (
			<>
				<Row xs={1} sm={2} md={3} className="g-4 justify-content-center">
					{pageMovies.map((mov) => (
						<Col key={mov.id} className="d-flex justify-content-center">
							<Card className="text-center" style={{ width: "18rem" }}>
							<Card.Img variant="top" src={mov.posterUrl} alt={mov.title} />
							<Card.Body className="d-flex flex-column justify-content-between">
								<Card.Title>{mov.title}</Card.Title>
								<Card.Text className="mov-card-desc">
									{mov.desc}
								</Card.Text>
								<Button variant="primary" onClick={() => navigate(`/books/${mov.id}`)}>
									View Details
								</Button>
							</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
				<ReactPaginate
					previousLabel={"<"}
					nextLabel={">"}
					pageCount={pageCnt}
					onPageChange={({ selected }) => setPage(selected)}
					containerClassName="pagination"
					previousLinkClassName="page-num"
					pageLinkClassName="page-num"
					nextLinkClassName="page-num"
					activeClassName="active"
				/>
			</>
		)}
		</Container>
	);
};

export default Movies;