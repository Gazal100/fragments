# Test to confirm 401 Unauthorized error when posting without authentication
POST http://localhost:8080/v1/fragments
Content-Type: text/plain

`This should fail due to missing authentication.`

# We expect to get back an HTTP 401 Unauthorized
HTTP/1.1 401
