# Cliniko API Integration Guide

## Overview
This project implements a secure proxy for the Cliniko API using Netlify Functions. It handles authentication, rate limiting, and provides a robust error handling system.

## API Endpoints

### Authentication
- `GET /api/cliniko-proxy/validate` - Validate Cliniko API key
- `GET /api/cliniko-proxy/patients` - Fetch patient list with pagination
- `GET /api/cliniko-proxy/practitioners` - Fetch practitioners list

### Rate Limits
- 150 requests per minute per API key
- Automatic rate limiting and queuing implemented
- Cached responses to minimize API calls

## Testing

Run the test suite:
```bash
npm run test
```

Run with coverage:
```bash
npm run test:coverage
```

### Manual Testing Steps

1. API Key Validation:
```bash
curl -X GET "http://localhost:8888/.netlify/functions/cliniko-proxy/validate" \
  -H "X-Cliniko-API-Key: your_api_key"
```

2. Fetch Patients:
```bash
curl -X GET "http://localhost:8888/.netlify/functions/cliniko-proxy/patients" \
  -H "X-Cliniko-API-Key: your_api_key"
```

## Error Handling

The API implements the following error status codes:

- 401: Invalid or missing API key
- 429: Rate limit exceeded
- 500: Internal server error
- 502: Bad gateway (Cliniko API unavailable)

## Security Considerations

1. API Key Protection
   - Keys are never logged or exposed in responses
   - Stored securely using environment variables

2. CORS Configuration
   - Strict origin checking
   - Proper headers for browser security

3. Rate Limiting
   - Per-key rate limiting
   - Automatic request queuing

## Best Practices

1. Always validate API keys before use
2. Implement proper error handling
3. Use pagination for large datasets
4. Cache responses when possible
5. Monitor rate limits

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm run test
```