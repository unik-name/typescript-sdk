### [4.2.2](https://github.com/spacelephant/typescript-sdk/compare/4.2.2-dev.1...4.2.2) (2021-05-04)

## [4.2.0](https://github.com/spacelephant/typescript-sdk/compare/4.0.0...4.2.0) (2021-05-03)


### Features

* add attributes to wallet response type ([a840164](https://github.com/spacelephant/typescript-sdk/commit/a84016463c4831aa51dcb43941ae7518f600e5dd))
* add events badge to properties white list ([3aaf1c3](https://github.com/spacelephant/typescript-sdk/commit/3aaf1c3518a4c695d488f02fc40ba5e552649351))
* add get block transactions function ([ef6c873](https://github.com/spacelephant/typescript-sdk/commit/ef6c873ec8257f592186d849e5d441d3dd17eecb))
* Add jwtProof in certification request body ([498bd15](https://github.com/spacelephant/typescript-sdk/commit/498bd155cd7c5250a6812161647cb5f1a59d62dd))
* add lifecyclestatusproof in certified update function ([ad5b42a](https://github.com/spacelephant/typescript-sdk/commit/ad5b42ab5cac8541826e2a999c525556407141dd))
* add nft factory event badge service ([0332040](https://github.com/spacelephant/typescript-sdk/commit/0332040986e0ab49927bb1cf9bab3100b75257a5))
* add orderId parameter ([fa22862](https://github.com/spacelephant/typescript-sdk/commit/fa22862172e675d4ac9d0481e1696de05ae03c69))
* add pagination for transaction search ([b1fdde2](https://github.com/spacelephant/typescript-sdk/commit/b1fdde248b24b422dcae4f0ed685f8f25a640ed4))
* add parameter to not filter properties ([f755e3f](https://github.com/spacelephant/typescript-sdk/commit/f755e3f60bb689b893a63285f40f08d896a8e1fb))
* add wallet search api ([95f3f98](https://github.com/spacelephant/typescript-sdk/commit/95f3f9819ed036cbccd6b7abe6d253b34b7c67e1))
* add wallet transactions function ([8395ec2](https://github.com/spacelephant/typescript-sdk/commit/8395ec2886573b9211e1bd026f7022ecbadc909c))
* increase timeout to 15s ([82be783](https://github.com/spacelephant/typescript-sdk/commit/82be783a9fa938ac05096137e4ef3a4e524d4ef2))
* remove tokenEcoV1 deadcode ([69ca242](https://github.com/spacelephant/typescript-sdk/commit/69ca242d44535c68c713bd7930e89f70d3dccd65))
* split did parse function parsing/checks ([ebfe1fe](https://github.com/spacelephant/typescript-sdk/commit/ebfe1fe9a27ed7696c6bef23363b1717b0b671f4))


### Bug Fixes

* createCertifiedNftMintTransaction parameters order ([7ac8f33](https://github.com/spacelephant/typescript-sdk/commit/7ac8f33c7973ed24e850005d861ef396549de3e6))
* Http Post request ([a50ff25](https://github.com/spacelephant/typescript-sdk/commit/a50ff2592e0a284da1e1356e3f1767de33561bcd))
* pionner badge key ([77d2980](https://github.com/spacelephant/typescript-sdk/commit/77d29804ef695d81fd4cbc046485d2782913c521))

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
