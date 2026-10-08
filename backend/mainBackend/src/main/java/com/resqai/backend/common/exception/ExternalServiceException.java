package com.resqai.backend.common.exception;

import org.springframework.http.HttpStatus;

/** Raised when an upstream disaster-data provider fails. Never fatal: the news
 *  service degrades to whatever providers did answer. */
public class ExternalServiceException extends ApiException {
    public ExternalServiceException(String message) {
        super(HttpStatus.BAD_GATEWAY, "UPSTREAM_ERROR", message);
    }
}
