# SaloneVibe - Quick Start Guide

## Prerequisites
- XAMPP installed and running
- Node.js and npm (for Tailwind CSS - optional)

## Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
   - On macOS: Open Applications → XAMPP → XAMPP Control Panel
   - Or search for "XAMPP" in Spotlight

2. **Start Services**
   - Click "Start" next to **Apache**
   - Click "Start" next to **MySQL**
   - Both should show green "Running" status

## Step 2: Setup Database

1. **Open phpMyAdmin**
   - Go to: `http://localhost/phpmyadmin`
   - Or click "Admin" button next to MySQL in XAMPP Control Panel

2. **Create Database**
   - Click "New" in the left sidebar
   - Database name: `salonevibe`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

3. **Import Schema**
   - Select the `salonevibe` database
   - Click "Import" tab
   - Click "Choose File"
   - Navigate to: `/Applications/XAMPP/xamppfiles/htdocs/Salone_Vibe/database/schema.sql`
   - Click "Go" to import
   - This creates tables and seeds 49 artists

## Step 3: Verify Configuration

Check that `config/config.php` has correct database settings:
- Host: `localhost`
- Database: `salonevibe`
- User: `root`
- Password: (empty for default XAMPP)

## Step 4: Build Tailwind CSS (Optional but Recommended)

If you want to use the compiled Tailwind CSS instead of CDN:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/Salone_Vibe
npm run build-css
```

Or for development with auto-rebuild:
```bash
npm run watch-css
```

## Step 5: Access the Application

Open your web browser and go to:

**Main Application:**
```
http://localhost/Salone_Vibe/public/
```

**API Health Check:**
```
http://localhost/Salone_Vibe/public/api/health
```

## Step 6: Test the Application

1. **Home Page**: Should show hero section and artist grid
2. **Navigation**: Click "Artists", "Favorites", "About" in sidebar
3. **Search**: Try searching for an artist
4. **Filters**: Use genre and city filters
5. **Artist Details**: Click "View Details" on any artist card
6. **Sign Up/Login**: Click "Log in / Sign up" button

## Default Admin Account

After database import, you can login with:
- **Email**: `admin@salonevibe.com`
- **Password**: `qwer18432`

## Troubleshooting

### Apache/MySQL won't start
- Check if ports 80 (Apache) and 3306 (MySQL) are already in use
- Stop other web servers (like MAMP, built-in Apache)
- Check XAMPP error logs

### Database connection error
- Verify MySQL is running in XAMPP
- Check `config/config.php` database credentials
- Ensure database `salonevibe` exists

### 404 errors on API calls
- Verify `.htaccess` file exists in `public/` folder
- Check Apache mod_rewrite is enabled
- Verify RewriteBase path in `.htaccess` matches your folder name

### Styles not loading
- Check browser console for errors
- Verify `assets/css/styles.css` exists
- If using Tailwind, run `npm run build-css`

### Page shows "Not Found"
- Verify URL: `http://localhost/Salone_Vibe/public/`
- Check folder name matches (should be `Salone_Vibe` not `Salone Vibe`)
- Ensure Apache is running

## Development Tips

1. **Watch Tailwind CSS changes:**
   ```bash
   npm run watch-css
   ```

2. **Check browser console** (F12) for JavaScript errors

3. **Check Apache error logs:**
   - `/Applications/XAMPP/xamppfiles/logs/error_log`

4. **Check MySQL error logs:**
   - `/Applications/XAMPP/xamppfiles/logs/mysql_error_log`

## Next Steps

- Add your own high-resolution images to replace placeholders
- Customize colors and branding in `public/assets/css/styles.css`
- Add more artists via Admin panel (when logged in as admin)
- Explore the API endpoints in browser DevTools Network tab

Enjoy using SaloneVibe! 🎵

