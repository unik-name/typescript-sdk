# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

-   add get block transaction endpoint support
-   add event badges to properties white list

### Changed

-   http timeouts increased from 10s to 15s

### Removed

## 4.0.0 2020-11-26

### Added

-   check if unik is allowed to vote depending on lifecycle (#3096)
-   get pioneer badge value function (#3094)
-   custom service option (#3023)
-   transaction schema check (#3023)
-   Add alive demand services (#2985)
-   token eco V2: set fees to 0 for individual mint (#2999)
-   Each HTTP client functions has been isolated into an importable function to enable tree-shaking in clients. They're callable like `fingerprintCompute` (`{repository}{function}` to be searched easier).

### Changed

-   HTTP client configuration has changed and has been merged to have a consistent API
    -   `DEFAULT_UNS_CONFIG` is a `UNSConfig` composed of 3 properties : `network`, `defaultHeaders` and `endpoints` (all by network)
    -   `chain` endpoint has been renamed to `network`
    -   `headers` becomes `defaultHeaders`
-   `fingerprint.compute` takes a DIDTypes instead of a DIDType
-   token eco V2: Set Lifecycle status to MINTED when minting (#2985)
-   Internal file organization has changed
    -   3 folders:
        -   `clients`: configurable http client, atomic http functions and old UNSClient (for backward compatibility)
        -   `functions`: old business functions but grouped by business value
        -   `utils`: SDK internal utilities (not exported)
    -   types has been spread into business folders (but they're still exported)

### Removed

## 3.3.0 - 2020-09-24

### Added

-   new services endpoint `GET /network-unit-services/mint`
-   add `cost` and `type` in `NetworkUnitService` type
-   create a new type `NetworkUnitMintService` inherits `NetworkUnitService`

## 3.2.0 - 2020-09-17

### Added

-   transaction unconfirmed endpoint (#2952)
-   merge Transaction type with core ITransactionData

## 3.1.0 - 2020-09-03

### Added

-   Add Everlasting service (#2902)
-   Add verified JWT type

## 3.0.0 - 2020-08-20

### Added

-   Add url checkers services (#2866)

### Changed

-   Official support of node 12 (#2852)

### Removed

-   Webpack bundle build (#2924)
