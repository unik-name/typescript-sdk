# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

-   get pioneer badge value function (#3094)
-   custom service option (#3023)
-   transaction schema check (#3023)
-   Add alive demand services (#2985)
-   token eco V2: set fees to 0 for individual mint (#2999)

### Changed

-   token eco V2: Set Lifecycle status to MINTED when minting (#2985)

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
