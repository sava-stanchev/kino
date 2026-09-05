package com.sava.kino.review;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ReviewForbiddenException extends RuntimeException {
}
