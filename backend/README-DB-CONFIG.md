# Database Configuration and Environment-Based Sync

This document explains the database configuration and environment-based sync strategies implemented in SPARTAN 4.

## Environment-Based Database Sync

The application now uses different database sync strategies based on the environment:

### Development Environment
- Uses `force: false` by default to preserve data
- Can force sync by setting `FORCE_DB_SYNC=true` in `.env`
- Never drops tables unless explicitly configured to do so

### Production Environment
- Always uses `force: false` to preserve user data
- Cannot be overridden by environment variables
- Designed to maintain data integrity in production

## Environment Variables

### NODE_ENV
- **development**: Enables development-specific features
- **production**: Enables production-specific optimizations

### FORCE_DB_SYNC
- **true**: Forces database sync (drops and recreates tables)
- **false** (default): Syncs without dropping existing tables
- Only effective in development environment

## Configuration Files

### .env (Development)
```bash
NODE_ENV=development
FORCE_DB_SYNC=false
```

### Production Deployment
Environment variables are typically set through deployment platforms:
- Vercel
- Heroku
- Docker
- Kubernetes

## Database Models

The database sync logic is implemented in `database/models.js`:

```javascript
async function syncDatabase() {
  try {
    // Use force: true only in development and when explicitly specified
    const isDevelopment = process.env.NODE_ENV === 'development';
    const forceSync = process.env.FORCE_DB_SYNC === 'true';
    
    // In production, never force sync
    const force = (isDevelopment && forceSync) || false;
    
    await sequelize.sync({ force });
    
    if (force) {
      console.log('✅ Database synced with force=true (development)');
    } else {
      console.log('✅ Database synced (without force)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    return false;
  }
}
```

## Testing Database Configuration

To test the database configuration:

1. **Check current configuration**:
   ```bash
   node backend/test-env-config.js
   ```

2. **Force sync in development**:
   ```bash
   # In .env
   FORCE_DB_SYNC=true
   ```

3. **Verify production behavior**:
   ```bash
   # In .env
   NODE_ENV=production
   FORCE_DB_SYNC=true  # This will be ignored in production
   ```

## Best Practices

1. **Development**:
   - Use `FORCE_DB_SYNC=false` to preserve test data
   - Only use `FORCE_DB_SYNC=true` when schema changes require it

2. **Production**:
   - Never use force sync
   - Use proper database migrations for schema changes
   - Always backup data before deployments

3. **Testing**:
   - Use separate test databases
   - Implement proper test data setup/teardown