# Proxy Performance Guide

## Overview
The `proxy.ts` file provides security and slug validation for your Next.js application. This guide explains how it impacts performance and how to optimize it.

## Performance Optimizations Applied ✅

### 1. **Extended Cache Duration (24 hours)**
- Slugs are cached in memory for 24 hours instead of 1 hour
- This means the API is only called once per day (after server restart)
- **Impact**: Reduces API calls by 96%

### 2. **Request Timeout (2 seconds)**
- If the API doesn't respond within 2 seconds, the request proceeds anyway
- Prevents slow API calls from blocking user requests
- **Impact**: Maximum 2s delay even if API is down

### 3. **Stale Cache Fallback**
- If API fails or times out, uses old cached data
- Only fetches fresh data if cache is empty
- **Impact**: Near-zero downtime even during API issues

### 4. **Static Route Bypass**
- Static assets and known routes skip slug validation entirely
- No API calls for: `/_next/*`, `/images/*`, `/admin/*`, etc.
- **Impact**: 90%+ of requests skip validation

## Performance Characteristics

### First Request (Cold Start)
- **Time**: 0-2 seconds (depending on API response)
- **What happens**: Fetches all slugs from API and caches them

### Subsequent Requests (Cache Hit)
- **Time**: <1ms
- **What happens**: Instant lookup in memory cache

### After 24 Hours (Cache Refresh)
- **Time**: 0-2 seconds
- **What happens**: Refreshes cache in background, uses stale cache if API is slow

## Maximum Performance Mode 🚀

If you need absolute maximum performance and are willing to sacrifice slug validation:

### Option 1: Disable Slug Validation (Recommended for High Traffic)

Add to your `.env.production`:
```bash
DISABLE_PROXY_SLUG_CHECK=true
```

**Pros:**
- Zero API calls
- Zero latency from proxy
- Maximum performance

**Cons:**
- Invalid URLs reach your app (Next.js still handles 404s)
- Slightly more server load for invalid requests
- Less protection against scanning/probing

### Option 2: Remove Proxy Entirely

If you don't need bot protection or slug validation:
1. Delete `proxy.ts`
2. Let Next.js handle all routing

**Pros:**
- Absolute maximum performance
- Simplest setup

**Cons:**
- No bot protection
- No early 404s for invalid slugs
- More server load from malicious requests

## Monitoring Performance

### Check if proxy is causing slowdowns:

1. **Check server logs** for these messages:
   - `Proxy: Slug fetch timed out` → API is slow
   - `Proxy: Using stale cache` → API is down/failing
   - `Proxy: Failed to fetch slugs` → API errors

2. **Monitor response times**:
   ```bash
   # Add this to your production monitoring
   console.time('proxy-slug-fetch')
   const slugs = await getValidSlugs()
   console.timeEnd('proxy-slug-fetch')
   ```

3. **Check cache hit rate**:
   - If cache is working: ~1 API call per 24 hours
   - If cache is broken: API call on every request

## Recommendations

### For Most Sites (Current Setup) ✅
- Keep current optimizations
- 24-hour cache + 2s timeout + stale fallback
- Good balance of security and performance

### For High-Traffic Sites
- Enable `DISABLE_PROXY_SLUG_CHECK=true`
- Rely on Next.js for 404 handling
- Monitor for increased invalid requests

### For Maximum Security
- Keep proxy enabled
- Reduce cache time to 1 hour
- Add rate limiting
- Monitor for suspicious patterns

## Troubleshooting

### "Pages are loading slowly in production"

1. **Check if it's the proxy:**
   ```bash
   # Temporarily disable slug check
   DISABLE_PROXY_SLUG_CHECK=true
   ```
   If pages load fast → proxy was the issue

2. **Check API response time:**
   - API should respond in <200ms
   - If >2s, optimize your `/api/all-slugs` endpoint

3. **Check cache:**
   - Verify cache is being used (should see logs only once per 24h)
   - If seeing frequent fetches, cache might not be working

### "Getting stale cache warnings"

- Your API is timing out or failing
- Check API health and response times
- Consider increasing `FETCH_TIMEOUT` if API is consistently slow

### "Too many API calls"

- Cache might not be persisting (serverless functions restart)
- Consider using Redis/external cache for serverless
- Or disable slug validation entirely

## Next Steps

1. **Monitor** your production logs for 24-48 hours
2. **Measure** actual impact on page load times
3. **Decide** if you need to disable slug validation
4. **Optimize** your `/api/all-slugs` endpoint if it's slow

---

**Current Status**: ✅ Optimized for production with 24h cache, 2s timeout, and stale fallback
