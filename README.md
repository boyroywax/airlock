# js-airlock-server

> Express.js server for Airlock


## Overview

Airlock is a decentralized authentication system built on top of IPFS and OrbitDB [1]. It is designed to be a drop-in replacement for traditional authentication systems such as OAuth2.0 and OpenID Connect. Airlock Server is designed to be used in conjunction with [Airlock Client]()

### Features

* Open multiple OrbitDb databases simultaneously
* Create new OrbitDb databases
* Open existing OrbitDb databases by address
* Add new entries to OrbitDb databases
* Get entries from OrbitDb databases by CID
* Delete entries from OrbitDb databases by CID
* Express API server with Swagger built in
* gRPC interface (coming soon)

## Quick Start

### Install

```bash
npm install
```

### Run

```bash
npm run bs
```


## References

[1] OrbitDB v2.0.1 Github Repo - [https://github.com/orbitdb/orbitdb/tree/v2.0.1](https://github.com/orbitdb/orbitdb/tree/v2.0.1)