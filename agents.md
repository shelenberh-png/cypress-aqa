# Cypress Project Instructions

This repository contains Cypress E2E tests.

## Project

Use the existing Cypress project structure.

Before modifying tests, inspect:

- package.json
- cypress.config.ts
- cypress/support
- existing specs in cypress/e2e

## Test code

Use the same language and style already used in the project.

Reuse existing:

- custom commands
- fixtures
- helpers
- Page Objects

Do not duplicate functionality that already exists.

## Selectors

Prefer stable selectors such as:

- data-cy
- data-test
- data-testid

Avoid selectors based on CSS classes or DOM position when a stable
test selector exists.

## Waiting

Do not add arbitrary waits such as:

cy.wait(5000)

When waiting for an API request, prefer cy.intercept() and aliases.

## Test isolation

Tests should be independent.

Do not make one test depend on another test.

## Verification

After modifying a Cypress spec, verify the affected spec.

Do not claim that a test passed unless it was actually executed.

If a test fails, report the real failure.

Do not weaken assertions simply to make a test pass.

## Security

Do not hardcode passwords, tokens, API keys, or other secrets.