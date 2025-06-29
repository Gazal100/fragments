# Test to confirm posting a JSON fragment works and a GET returns the correct data
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`
# We expect to get back an HTTP 201
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragments.id" matches "^([0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" =="application/json"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragments.size" == 19

[Captures]
url: header "Location"
# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json
Content-Length: 19
[Asserts]
body == "This is a fragment!"