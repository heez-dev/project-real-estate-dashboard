# Project Real Estate Dashboard

A real estate transaction dashboard built with public OpenAPI data from data.go.kr.

This project is a portfolio-focused frontend application designed to demonstrate enterprise-style dashboard architecture, search-driven data querying, server state management, and maintainable UI composition.

## Overview

The dashboard provides apartment transaction insights based on public real estate transaction data in South Korea.

Users can:

- View transaction summary metrics
- Search apartment transaction records by region and contract month
- Compare sales, jeonse, and monthly rent transactions
- Explore regional transaction summaries
- Review recent transaction records

## Tech Stack

### Core

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### State Management

- TanStack Query
- Zustand

### Forms & Validation

- Zod

### UI

- shadcn/ui
- Radix UI
- lucide-react

### Data

- Public OpenAPI from data.go.kr
- fast-xml-parser

### Planned

- React Hook Form
- AG Grid
- Chart.js
- xlsx
- Papa Parse

## Data Sources

### Apartment Sales Transactions

Apartment sales transaction data provided through the public MOLIT OpenAPI.

### Apartment Rent Transactions

Apartment jeonse and monthly rent transaction data provided through the public MOLIT OpenAPI.

### Legal District Codes

Administrative legal district code data used for hierarchical region selection.

The region selector supports:

- Province-level selection
- District-level selection
- Town-level filtering
- Normalized labels for legacy or duplicated administrative names

## Features

### Dashboard

- Server-rendered initial dashboard data
- Transaction summary metrics
- Sales, jeonse, and monthly rent counts
- Month-over-month comparison
- Regional top transaction summary
- Recent transaction overview

### Search Conditions

- Transaction type filtering
- Province, district, and town filtering
- Contract month filtering
- Zod-based validation
- Query state separated from input state

### Data Handling

- Public XML API response parsing
- Internal normalized transaction models
- Client-side query caching with TanStack Query
- Full-page data fetching for dashboard summary accuracy
- Post-query town-level filtering

## Planned Features

### Data Grid

- Sorting
- Filtering
- Pagination
- Column visibility
- Custom cell rendering

### Data Visualization

- Transaction volume charts
- Regional distribution charts
- Transaction type comparison charts

### Data Export

- CSV export
- Excel export
- Export based on active search conditions

### Transaction Detail

- Detailed transaction information
- Apartment-level transaction history
- Related regional context

## Project Structure

```text
src
├── entities
│   ├── apartment-trade
│   └── legal-dong-code
├── features
│   ├── dashboard-filter
│   ├── dashboard-result
│   └── transaction-search
├── shared
│   ├── api
│   ├── components
│   ├── model
│   ├── providers
│   └── stores
└── widgets
