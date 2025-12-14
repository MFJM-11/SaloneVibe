<?php // Tailwind + custom glass UI for SaloneVibe ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaloneVibe | Discover Sierra Leone Music</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css">
    <!-- Tailwind CSS - Use compiled version if available, fallback to CDN -->
    <?php if (file_exists(__DIR__ . '/assets/css/styles-tailwind.css')): ?>
        <link rel="stylesheet" href="assets/css/styles-tailwind.css">
    <?php else: ?>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  accentStart: '#00FF5B',
                  accentEnd: '#0014FF',
                  bgDark: '#05060f',
                }
              }
            }
          }
        </script>
    <?php endif; ?>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="app-bg text-slate-100">
<div class="app-shell">
    <aside class="sidebar glass-strong">
        <div class="brand-row">
            <div class="brand-mark">
                <i class="ri-music-2-fill"></i>
            </div>
            <div>
                <div class="brand-name">VIBE</div>
            </div>
        </div>
        <nav class="nav-stack" id="navMenu">
            <a class="nav-item active" href="#" data-page="home"><i class="ri-home-5-line"></i>Home</a>
            <a class="nav-item" href="#" data-page="artists"><i class="ri-disc-line"></i>Browse</a>
            <a class="nav-item" href="#" data-page="favorites"><i class="ri-heart-3-line"></i>Favorites</a>
            <a class="nav-item" href="#" data-page="about"><i class="ri-information-line"></i>About</a>
            <a class="nav-item hidden" id="adminNav" href="#" data-page="admin"><i class="ri-shield-star-line"></i>Admin</a>
        </nav>

        <div class="sidebar-playlists">
            <h4 class="playlists-title">Playlists</h4>
            <div id="favoritesList" class="playlists-list">
                <div id="favoritesPrompt" class="text-slate-400 text-sm p-3">Log in to see your playlists.</div>
                <!-- Favorite playlists will be injected here -->
            </div>
        </div>

        <div class="sidebar-footer">
             <div class="unauth">
                <button class="btn-gradient w-full" data-open="authModal">Log in / Sign up</button>
            </div>
            <div class="authed hidden user-box">
                <div class="profile-avatar" id="profileAvatar">SV</div>
                <div>
                    <div class="font-semibold" id="profileName">User</div>
                    <div class="text-xs text-slate-400" id="profileEmail">user@example.com</div>
                </div>
                <div class="flex gap-2">
                    <button class="btn-soft pill" data-open="profileModal">Profile</button>
                    <button class="btn-soft pill" id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>
    </aside>

    <main class="main-area" id="top">
        <header class="main-header glass">
            <div class="search-bar">
                <i class="ri-search-line"></i>
                <input type="text" id="searchInput" placeholder="Search for artists, songs, albums...">
            </div>
            <div class="user-profile">
                <button class="btn-soft pill">Upgrade</button>
                <div class="profile-avatar" id="profileAvatar">SV</div>
            </div>
        </header>

        <!-- Home Page -->
        <div id="homePage" class="page-content">
            <div class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Pop Right Now</h1>
                    <p class="hero-subtitle">The most popular pop songs, updated weekly.</p>
                    <div class="hero-actions">
                        <button class="btn-cta" id="heroBtn"><i class="ri-play-fill"></i> Play</button>
                        <button class="btn-soft pill" data-open="authModal">Follow</button>
                    </div>
                </div>
            </div>
            <section class="filters glass">
                    <div class="filter-group">
                        <label class="filter-label">Search artist</label>
                        <div class="filter-input">
                            <i class="ri-search-line"></i>
                            <input type="text" id="searchInput" placeholder="Name or stage name">
                        </div>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Genre</label>
                        <select id="genreSelect">
                            <option value="">All genres</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">City / Region</label>
                        <select id="citySelect">
                            <option value="">All locations</option>
                        </select>
                    </div>
                </section>
            <section class="content-grid" id="artistGridView">
                <div class="stack">
                    <div id="loadingBar" class="hidden text-sm text-slate-300">Loading artists...</div>
                    <div id="artistGrid" class="card-grid"></div>
                    <div id="pagination" class="pagination"></div>
                </div>
                <div class="detail-stack">
                    <div class="glass-strong detail-card" id="artistDetail">
                        <div class="text-slate-400 text-sm">Select an artist to view details.</div>
                    </div>
                    <div id="detailLoading" class="hidden text-sm text-slate-300 mt-2">Loading artist...</div>
                </div>
            </section>
        </div>

        <!-- Artists Page -->
        <div id="artistsPage" class="page-content hidden">
            <div class="page-header glass-strong">
                <div>
                    <h1 class="page-title">All Artists</h1>
                    <p class="page-subtitle">Discover talented artists from Sierra Leone</p>
                </div>
            </div>
            <section class="filters glass">
                <div class="filter-group">
                    <label class="filter-label">Search artist</label>
                    <div class="filter-input">
                        <i class="ri-search-line"></i>
                        <input type="text" id="artistsPageSearch" placeholder="Name or stage name">
                    </div>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Genre</label>
                    <select id="artistsPageGenre">
                        <option value="">All genres</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">City / Region</label>
                    <select id="artistsPageCity">
                        <option value="">All locations</option>
                    </select>
                </div>
            </section>
            <div class="content-grid-full">
                <div id="loadingBarArtists" class="hidden text-sm text-slate-300">Loading artists...</div>
                <div id="artistsPageGrid" class="card-grid"></div>
                <div id="paginationArtists" class="pagination"></div>
            </div>
        </div>

        <!-- Favorites Page -->
        <div id="favoritesPage" class="page-content hidden">
            <div class="page-header glass-strong">
                <div>
                    <h1 class="page-title">My Favorites</h1>
                    <p class="page-subtitle">Your saved artists</p>
                </div>
            </div>
            <div id="favoritesPageContent" class="content-grid-full">
                <div id="favoritesPageGrid" class="card-grid"></div>
            </div>
        </div>

        <!-- About Page -->
        <div id="aboutPage" class="page-content hidden">
            <div class="page-header glass-strong">
                <div>
                    <h1 class="page-title">About SaloneVibe</h1>
                    <p class="page-subtitle">Discovering Sierra Leone's musical talent</p>
                </div>
            </div>
            <div class="about-content glass">
                <div class="about-section">
                    <h2 class="about-section-title">Our Mission</h2>
                    <p class="about-text">SaloneVibe is dedicated to showcasing the rich and diverse musical talent from Sierra Leone. We provide a platform for artists to be discovered and for music lovers to explore the vibrant sounds of Salone.</p>
                </div>
                 <div class="about-section">
                    <h2 class="about-section-title">Get Started</h2>
                    <p class="about-text">Create an account to save your favorites and personalize your experience. Start exploring the sounds of Salone today!</p>
                    <button class="btn-gradient mt-4" data-open="authModal">Sign Up Now</button>
                </div>
            </div>
        </div>

        <!-- Artist Dashboard Page -->
        <section id="artistDashboard" class="hidden artist-dashboard">
            <!-- Content from original file -->
        </section>

        <!-- Admin Page -->
        <div id="adminPage" class="page-content hidden">
             <div class="page-header glass-strong">
                <div>
                    <h1 class="page-title">Admin Dashboard</h1>
                    <p class="page-subtitle">Manage artists & accounts</p>
                </div>
            </div>
            <div class="panel-grid">
                <div class="card glass">
                    <h4 class="card-title">Add Artist Profile</h4>
                    <form id="adminArtistForm" class="form-grid">
                        <input class="input-glass" name="name" placeholder="Name" required>
                        <input class="input-glass" name="stage_name" placeholder="Stage Name">
                        <input class="input-glass" name="genre" placeholder="Genre" required>
                        <input class="input-glass" name="city_or_region" placeholder="City / Region" required>
                        <textarea class="input-glass" name="bio" placeholder="Bio"></textarea>
                        <button class="btn-gradient w-full" type="submit">Create Artist</button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</div>

<footer class="music-player glass-strong">
    <div class="player-left">
        <div class="player-album-art image-placeholder"></div>
        <div class="player-song-info">
            <div class="player-song-title">Song Title</div>
            <div class="player-song-artist">Artist Name</div>
        </div>
        <button class="ctrl"><i class="ri-heart-line"></i></button>
    </div>
    <div class="player-center">
        <div class="player-controls">
            <button class="ctrl"><i class="ri-shuffle-line"></i></button>
            <button class="ctrl"><i class="ri-skip-back-fill"></i></button>
            <button class="ctrl primary"><i class="ri-play-fill"></i></button>
            <button class="ctrl"><i class="ri-skip-forward-fill"></i></button>
            <button class="ctrl"><i class="ri-repeat-line"></i></button>
        </div>
        <div class="player-progress">
            <span class="time">1:16</span>
            <div class="progress-bar">
                <div class="progress-track" style="width: 35%;"></div>
            </div>
            <span class="time">4:20</span>
        </div>
    </div>
    <div class="player-right">
        <button class="ctrl"><i class="ri-play-list-2-line"></i></button>
        <button class="ctrl"><i class="ri-computer-line"></i></button>
        <button class="ctrl"><i class="ri-volume-up-line"></i></button>
        <div class="volume-bar">
            <div class="volume-track" style="width: 70%;"></div>
        </div>
    </div>
</footer>

<!-- Modals and Toast -->
<div id="authModal" class="modal hidden">
  <div class="auth-modal-container">
    <button class="auth-close-btn" data-close="authModal"><i class="ri-close-line"></i></button>
    
    <!-- Left Promotional Column -->
    <div class="auth-promo-column">
      <div class="auth-promo-content">
        <h2 class="auth-promo-title">Listen to your top musics</h2>
        <h3 class="auth-promo-subtitle">FOR FREE</h3>
        <div class="auth-promo-image image-placeholder">
          <!-- High-resolution promotional image placeholder -->
        </div>
      </div>
    </div>

    <!-- Right Form Column -->
    <div class="auth-form-column glass-strong">
      <div class="auth-form-header">
        <div class="auth-tab-switcher">
          <button class="auth-tab-switch active" data-toggle="auth-tab" data-target="signupTab">Sign Up</button>
          <button class="auth-tab-switch" data-toggle="auth-tab" data-target="userLoginTab">Sign In</button>
          <button class="auth-tab-switch" data-toggle="auth-tab" data-target="artistLoginTab">Artist</button>
        </div>
      </div>

      <!-- Sign Up Tab -->
      <div id="signupTab" class="auth-tab">
        <h2 class="auth-form-title">Sign Up</h2>
        <form id="signupForm" class="auth-form">
          <div class="auth-form-row">
            <div class="auth-form-group">
              <label class="auth-label">First Name</label>
              <input type="text" name="first_name" class="auth-input" placeholder="First Name">
            </div>
            <div class="auth-form-group">
              <label class="auth-label">Last Name</label>
              <input type="text" name="last_name" class="auth-input" placeholder="Last Name">
            </div>
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Email</label>
            <input type="email" name="email" class="auth-input" placeholder="Email" required>
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input type="password" name="password" class="auth-input" placeholder="Password" required minlength="6">
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Re-enter password</label>
            <input type="password" name="password_confirm" class="auth-input" placeholder="Re-enter password" required>
          </div>
          <div class="auth-checkbox-group">
            <input type="checkbox" id="termsCheck" name="terms" required>
            <label for="termsCheck" class="auth-checkbox-label">
              I've read and agree with <a href="#" class="auth-link">Terms of Service</a> and our <a href="#" class="auth-link">Privacy Policy</a>
            </label>
          </div>
          <button class="auth-submit-btn" type="submit">Sign up</button>
        </form>
      </div>

      <!-- Sign In Tab -->
      <div id="userLoginTab" class="auth-tab hidden">
        <h2 class="auth-form-title">Sign In</h2>
        <form id="loginForm" class="auth-.form">
          <div class="auth-form-group">
            <label class="auth-label">Email</label>
            <input type="email" name="email" class="auth-input" placeholder="Email" required>
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input type="password" name="password" class="auth-input" placeholder="Password" required>
          </div>
          <button class="auth-submit-btn" type="submit">Sign in</button>
        </form>
      </div>

      <!-- Artist Login Tab -->
      <div id="artistLoginTab" class="auth-tab hidden">
        <h2 class="auth-form-title">Artist Sign In</h2>
        <form id="artistLoginForm" class="auth-form">
          <div class="auth-form-group">
            <label class="auth-label">Artist Email</label>
            <input type="email" name="email" class="auth-input" placeholder="Artist Email" required>
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input type="password" name="password" class="auth-input" placeholder="Password" required>
          </div>
          <p class="auth-info-text">Artist accounts are created by admin.</p>
          <button class="auth-submit-btn" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  </div>
</div>
<div id="profileModal" class="modal hidden">
  <div class="modal-box glass-strong rounded-2xl p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xl font-semibold">Profile</h3>
      <button class="btn-soft rounded-full px-3 py-1" data-close="profileModal"><i class="ri-close-line"></i></button>
    </div>
    <form id="profileForm" class="space-y-3">
        <div>
            <label class="text-sm text-slate-300">Display Name</label>
            <input type="text" name="display_name" class="input-glass">
        </div>
        <div>
            <label class="text-sm text-slate-300">Profile Image URL</label>
            <input type="text" name="profile_image_url" class="input-glass">
        </div>
        <div>
            <label class="text-sm text-slate-300">Bio</label>
            <textarea name="bio" class="input-glass min-h-[80px]"></textarea>
        </div>
        <div>
            <label class="text-sm text-slate-300">Location</label>
            <input type="text" name="location" class="input-glass">
        </div>
        <button class="btn-gradient w-full py-2 rounded-full" type="submit">Save Profile</button>
    </form>
  </div>
</div>
<div id="toast" class="toast hidden fixed bottom-4 right-4 glass-strong px-4 py-3 rounded-xl text-white">
    Notification
</div>


<!-- Load modules in dependency order -->
<script src="assets/js/core/config.js"></script>
<script src="assets/js/core/utils.js"></script>
<script src="assets/js/services/api.js"></script>
<script src="assets/js/services/auth.js"></script>
<script src="assets/js/services/favorites.js"></script>
<script src="assets/js/ui/admin.js"></script>
<script src="assets/js/ui/ui.js"></script>
<script src="assets/js/core/app.js"></script>
</body>
</html>