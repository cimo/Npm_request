# Npm_request

Npm package, request api. Light, fast and secure.
Writed with native Typescript code and no dependencies are used.

## Pack

1. npm run pack
2. Copy the file "package_name-x.x.x.tgz" in the project root folder.
3. In the "package.json" file insert: "@cimo/package_name": "file:package_name-x.x.x.tgz"

## Publish

1. npm run build
2. npm login --auth-type=legacy
3. npm publish --auth-type=legacy --access public

## Installation

1. Link for npm package -> https://www.npmjs.com/package/@cimo/request

## Info

Support the encoding if your application have some firewall like "azure waf".
The request body will be fully encoded and from backend need be decoded and processed.
By default is "false".

## Client

- Client.ts

```
...

import { Cr } from "@cimo/request/dist/src/Main";

...

const cr = new Cr("https://localhost", 25000, false);

cr.setRequestInterceptor((config) => {
    //...

    return {
        ...config,
        headers: {
            ...config.headers,
            "Accept-Language": "en,ja;q=0.9"
        }
    };
});

cr.setResponseInterceptor((response) => {
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

cr.post("/test_post_json",
            {
                headers: {
                    "Content-Type": "application/json"
                }
            },
            data
        )
        .then((data) => {
            // Response
        })
        .catch((error) => {
            // Error
        });

...

const formData = new FormData();
formData.append("token_api", "1234");
formData.append("name", "test");
// In case of file upload, just remove the headers content-type parameter.

cr.post("/test_post_form-data",
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            formData
        )
        .then((data) => {
            // Response
        })
        .catch((error) => {
            // Error
        });

...

cr.get("/test_get", {})
    .then((data) => {
        // Response
    })
    .catch((error) => {
        // Error
    });

// put, delete, patch

...

```
