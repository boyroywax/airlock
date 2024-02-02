# js-airlock-server

> Express.js server for Airlock


## Overview

Airlock is a decentralized authentication system built on top of IPFS and OrbitDB [1]. It is designed to be a drop-in replacement for traditional authentication systems such as OAuth2.0 and OpenID Connect. Airlock Server is designed to be used in conjunction with [Airlock Client]()

### Features

* Create new OrbitDb databases
* Open multiple OrbitDb databases simultaneously
* Supports currently available OrbitDb database types
* Add new entries to OrbitDb databases
* Get entries from OrbitDb databases by CID
* Delete entries from OrbitDb databases by CID
* Express API server with Swagger documentation
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

## API

The API is documented using Swagger and can be accessed at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Database Management

[] Create a new database
[] Open an existing database
[] List all open databases
[] Close a database

### Entry Management

[] Add a new entry to a database
[] Get an entry from a database
[] Delete an entry from a database


## gRPC

gRPC is coming soon






## References

[1] OrbitDB v2.0.1 Github Repo - [https://github.com/orbitdb/orbitdb/tree/v2.0.1](https://github.com/orbitdb/orbitdb/tree/v2.0.1)