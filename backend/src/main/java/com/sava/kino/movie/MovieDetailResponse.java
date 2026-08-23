package com.sava.kino.movie;

import java.time.LocalDate;

public record MovieDetailResponse(Long id, String title, String desc, String posterUrl,
                                  LocalDate releaseDate, Integer runtime, String lang) {
}
