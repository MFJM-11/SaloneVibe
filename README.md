# SaloneVibe

Sierra Leone music discovery MVP built with PHP, MySQL, Tailwind, and vanilla JS. Features search, filters, artist detail, auth, and favorites.

## Stack
- PHP 8+ (PDO)
- MySQL 5.7/8
- Tailwind CSS (CDN) + Remix Icon
- Vanilla JavaScript

## Project structure
```
public/           # Web root (serve this)
  index.php       # Frontend shell
  assets/         # CSS/JS
api/              # REST endpoints
config/config.php # DB + JWT config
database/schema.sql # Tables + seed (49 artists)
```

## Setup
1) Install dependencies: PHP 8+, MySQL.
2) Create database:
```sql
CREATE DATABASE salonevibe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salonevibe;
SOURCE database/schema.sql;
```
3) Configure `config/config.php` with DB credentials and a strong `jwt_secret`.
4) Serve the app from `public`:
```bash
php -S localhost:8000 -t public
```
The API is mounted at `/api`.

## API (condensed)
- `GET /api/artists?search=&genre=&city_or_region=&page=&limit=` – paginated list.
- `GET /api/artists/:id` – artist detail.
- `POST /api/auth/signup` – `{email, password, display_name}`.
- `POST /api/auth/login` – `{email, password}`.
- `GET /api/users/me` – requires `Authorization: Bearer <token>`.
- `PUT /api/users/me` – update profile fields.
- `GET /api/favorites` – list favorites (auth).
- `POST /api/favorites` – `{artist_id}` (auth).
- `DELETE /api/favorites/:artist_id` – remove (auth).

## Theming
- Primary gradient: `#00FF5B → #0014FF` (see `assets/css/styles.css`).
- Glassmorphism tokens: tweak `--glass`, `--border`, `--bg-dark`.

## Notes
- Seed contains 49 Sierra Leonean artists with genres, cities, songs, and social links.
- Favorites require login; unauthenticated users are prompted to sign in.
- Add more artists by inserting into `artists` and ensuring `notable_songs` stays JSON text.

## Quick test flow
1) Start server + DB.
2) Visit `/` → see hero + artist grid.
3) Search/filter; open an artist → detail pane updates.
4) Sign up → add artist to favorites → verify favorites list updates.
5) Update profile in the Profile modal; confirm changes persist on reload.

