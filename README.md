# Request

Request management. Light, fast and secure.

## Publish

1. npm run build
2. npm login --auth-type=legacy
3. npm publish --auth-type=legacy --access public

## Installation

1. Link for npm package -> https://www.npmjs.com/package/@cimo/request

## Client

-   Index.ts

```
...

import * as Cr from "@cimo/request";

...

Cr.create("https://localhost", 30000);

Cr.setRequestInterceptor((config) => {
    //...

    return {
        ...config,
        headers: {
            "Accept-Language": "en,ja;q=0.9"
        }
    };
});

Cr.setResponseInterceptor((response) => {
    if (response.ok) {
        // Success
    } else {
        // Fail
    }
});

...

const data = {
    token_api: "1234",
    name: "test",
};

const formData = new FormData();
formData.append("token_api", "1234");
formData.append("name", "test");

Cr.post("/test_post", {}, formData) // Or use json data
    .then((data) => {
        // Response
    })
    .catch((error) => {
        // Error
    });

Cr.post("/test_get", {})
    .then((data) => {
        // Response
    })
    .catch((error) => {
        // Error
    });

...

```
