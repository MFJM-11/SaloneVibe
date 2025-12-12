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
                <div class="brand-name">SaloneVibe</div>
                <div class="brand-sub">Sierra Leone sounds</div>
            </div>
        </div>
        <nav class="nav-stack" id="navMenu">
            <a class="nav-item active" href="#" data-page="home"><i class="ri-home-5-line"></i>Home</a>
            <a class="nav-item" href="#" data-page="artists"><i class="ri-play-list-line"></i>Artists</a>
            <a class="nav-item" href="#" data-page="favorites"><i class="ri-heart-3-line"></i>Favorites</a>
            <a class="nav-item" href="#" data-page="about"><i class="ri-information-line"></i>About</a>
            <a class="nav-item hidden" id="adminNav" href="#" data-page="admin"><i class="ri-shield-star-line"></i>Admin</a>
        </nav>
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
        <!-- Home Page -->
        <div id="homePage" class="page-content">
            <div class="hero-grid">
                <div class="hero-panel gradient">
                    <div class="hero-meta">
                        <div class="pill pill-light">What's hot</div>
                        <h1 class="hero-title">The Sound of Salone</h1>
                        <p class="hero-copy">Top artists from Sierra Leone. Browse, filter, and save your favorites.</p>
                        <div class="hero-actions">
                            <button class="btn-cta" id="heroBtn"><i class="ri-play-fill"></i> Explore artists</button>
                            <button class="btn-soft pill" data-open="authModal">Follow</button>
                        </div>
                        <div class="hero-stats">
                            <div>
                                <div class="stat-label">Artists</div>
                                <div class="stat-value">49+</div>
                            </div>
                            <div>
                                <div class="stat-label">Genres</div>
                                <div class="stat-value">12</div>
                            </div>
                            <div>
                                <div class="stat-label">Cities</div>
                                <div class="stat-value">7</div>
                            </div>
                        </div>
                    </div>
                    <div class="hero-visual">
                        <div class="hero-card glass-strong">
                            <div class="hero-image image-placeholder" style="width: 100%; height: 120px; border-radius: 12px; margin-bottom: 12px;">
                                <!-- Trending artist/image placeholder -->
                            </div>
                            <div class="text-sm text-slate-300">Trending</div>
                            <div class="hero-track">#SaloneVibe</div>
                            <div class="hero-sub">Fresh picks updated live</div>
                            <div class="hero-buttons">
                                <button class="btn-cta alt"><i class="ri-play-fill"></i> Play</button>
                                <button class="btn-soft pill" data-open="authModal">Follow</button>
                            </div>
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
            </div>

            <!-- Artist Grid View -->
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
                    <h2 class="about-section-title">Features</h2>
                    <ul class="about-list">
                        <li><i class="ri-check-line"></i> Browse 49+ artists from Sierra Leone</li>
                        <li><i class="ri-check-line"></i> Search and filter by genre, city, and region</li>
                        <li><i class="ri-check-line"></i> Save your favorite artists</li>
                        <li><i class="ri-check-line"></i> Discover new music and talent</li>
                        <li><i class="ri-check-line"></i> Connect with artists through social links</li>
                    </ul>
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
            <div class="dashboard-header">
                <div class="dashboard-nav">
                    <button class="nav-back-btn" id="backToGrid"><i class="ri-arrow-left-line"></i></button>
                    <div class="dashboard-user">
                        <div class="profile-avatar small" id="dashboardUserAvatar">U</div>
                        <span id="dashboardUserName" class="hidden">User</span>
                    </div>
                </div>
            </div>

            <div class="artist-header glass-strong">
                <div class="artist-header-content">
                    <div class="artist-info-section">
                        <div class="verified-badge">
                            <i class="ri-checkbox-circle-fill"></i>
                            <span>Verified artist</span>
                        </div>
                        <h1 class="artist-name" id="dashboardArtistName">Artist Name</h1>
                        <div class="monthly-listeners" id="dashboardListeners">0 monthly listeners</div>
                        <div class="artist-actions">
                            <button class="btn-play" id="dashboardPlayBtn">
                                <i class="ri-play-fill"></i> Play
                            </button>
                            <button class="btn-follow" id="dashboardFollowBtn">Follow</button>
                            <button class="btn-link" id="dashboardRadioBtn">Go to artist radio</button>
                            <button class="btn-link" id="dashboardShareBtn">Share</button>
                        </div>
                    </div>
                    <div class="artist-image-section">
                        <div class="artist-image" id="dashboardArtistImage">
                            <div class="avatar large">SV</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-nav-tabs glass">
                <button class="tab-btn active" data-tab="popular">
                    <i class="ri-fire-line"></i> Popular
                </button>
                <button class="tab-btn" data-tab="discography">
                    <i class="ri-album-line"></i> Discography
                </button>
                <button class="tab-btn" data-tab="featuring">
                    <i class="ri-music-2-line"></i> Featuring
                </button>
                <button class="tab-btn" data-tab="fans">
                    <i class="ri-lightbulb-line"></i> Fans also like
                </button>
                <button class="tab-btn" data-tab="appears">
                    <i class="ri-folder-music-line"></i> Appears on
                </button>
            </div>

            <div class="dashboard-content">
                <div class="tab-content active" id="tab-popular">
                    <h2 class="section-title">Popular</h2>
                    <div class="songs-list" id="popularSongsList">
                        <!-- Songs will be rendered here -->
                    </div>
                </div>
                <div class="tab-content" id="tab-discography">
                    <h2 class="section-title">Discography</h2>
                    <div class="text-slate-400">Loading...</div>
                </div>
                <div class="tab-content" id="tab-featuring">
                    <h2 class="section-title">Featuring</h2>
                    <div class="text-slate-400">Loading...</div>
                </div>
                <div class="tab-content" id="tab-fans">
                    <h2 class="section-title">Fans also like</h2>
                    <div class="text-slate-400">Loading...</div>
                </div>
                <div class="tab-content" id="tab-appears">
                    <h2 class="section-title">Appears on</h2>
                    <div class="text-slate-400">Loading...</div>
                </div>
            </div>
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
                        <input class="input-glass" name="country" placeholder="Country" value="Sierra Leone">
                        <textarea class="input-glass" name="bio" placeholder="Bio"></textarea>
                        <input class="input-glass" name="notable_songs" placeholder="Notable songs (comma separated)">
                        <input class="input-glass" name="image_url" placeholder="Image URL">
                        <input class="input-glass" name="social_youtube" placeholder="YouTube link">
                        <input class="input-glass" name="social_spotify" placeholder="Spotify link">
                        <input class="input-glass" name="social_instagram" placeholder="Instagram link">
                        <input class="input-glass" name="social_facebook" placeholder="Facebook link">
                        <button class="btn-gradient w-full" type="submit">Create Artist</button>
                    </form>
                </div>
                <div class="card glass">
                    <h4 class="card-title">Create Artist Account</h4>
                    <form id="adminArtistAccountForm" class="form-grid">
                        <input class="input-glass" name="display_name" placeholder="Display Name" required>
                        <input class="input-glass" name="email" placeholder="Email" type="email" required>
                        <input class="input-glass" name="password" placeholder="Password" type="password" required>
                        <button class="btn-soft w-full" type="submit">Create Artist Login</button>
                    </form>
                    <p class="text-xs text-slate-400 mt-2">Artist logins use role "artist"; they can sign in but not access admin.</p>
                </div>
            </div>
        </div>
    </main>

    <aside class="right-rail">
        <div class="card glass">
            <div class="section-head">
                <h4>Tags</h4>
                <i class="ri-equalizer-line text-slate-400"></i>
            </div>
            <div class="tag-cloud" id="genreTags">
                <!-- Tags injected via JS -->
            </div>
        </div>

        <div class="card glass" id="favoritesPanel">
            <div class="section-head">
                <h4>Favorites</h4>
                <i class="ri-heart-3-fill text-emerald-400"></i>
            </div>
            <div id="favoritesPrompt" class="text-slate-400 text-sm">Log in to save favorites.</div>
            <div id="favoritesList" class="mt-3 space-y-2"></div>
        </div>

        <div class="card glass mini-player">
            <div class="section-head">
                <h4>Now Playing</h4>
                <span class="pill pill-soft">Demo</span>
            </div>
            <div class="mini-meta">
                <div class="cover image-placeholder">
                    <!-- Album cover image placeholder -->
                </div>
                <div>
                    <div class="mini-title">Discover Salone</div>
                    <div class="mini-sub">Curated by SaloneVibe</div>
                </div>
            </div>
            <div class="controls">
                <button class="ctrl"><i class="ri-skip-back-mini-fill"></i></button>
                <button class="ctrl primary"><i class="ri-play-fill"></i></button>
                <button class="ctrl"><i class="ri-skip-forward-mini-fill"></i></button>
            </div>
            <div class="progress">
                <div class="progress-track"><span style="width: 35%;"></span></div>
                <div class="progress-times">
                    <span>1:16</span>
                    <span>4:20</span>
                </div>
            </div>
        </div>
    </aside>
</div>
<!-- Auth Modal -->
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
        <div class="auth-divider">
          <span>OR</span>
        </div>
        <div class="auth-social-buttons">
          <button class="auth-social-btn" type="button">
            <i class="ri-google-fill"></i>
            <span>Sign up with Google</span>
          </button>
          <button class="auth-social-btn" type="button">
            <i class="ri-facebook-fill"></i>
            <span>Sign up with Facebook</span>
          </button>
        </div>
        <div class="auth-footer-link">
          Already have an account? <button class="auth-link-btn" data-toggle="auth-tab" data-target="userLoginTab">Sign in</button>
        </div>
      </div>

      <!-- Sign In Tab -->
      <div id="userLoginTab" class="auth-tab hidden">
        <h2 class="auth-form-title">Sign In</h2>
        <form id="loginForm" class="auth-form">
          <div class="auth-form-group">
            <label class="auth-label">Email</label>
            <input type="email" name="email" class="auth-input" placeholder="Email" required>
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input type="password" name="password" class="auth-input" placeholder="Password" required>
          </div>
          <div class="auth-form-footer">
            <label class="auth-checkbox-label">
              <input type="checkbox" name="remember">
              <span>Remember me</span>
            </label>
            <button type="button" class="auth-link-btn">Forgot Password?</button>
          </div>
          <button class="auth-submit-btn" type="submit">Sign in</button>
        </form>
        <div class="auth-divider">
          <span>OR</span>
        </div>
        <div class="auth-social-buttons">
          <button class="auth-social-btn" type="button">
            <i class="ri-google-fill"></i>
            <span>Sign in with Google</span>
          </button>
          <button class="auth-social-btn" type="button">
            <i class="ri-facebook-fill"></i>
            <span>Sign in with Facebook</span>
          </button>
        </div>
        <div class="auth-footer-link">
          Don't have an account? <button class="auth-link-btn" data-toggle="auth-tab" data-target="signupTab">Sign up</button>
        </div>
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
        <div class="auth-footer-link">
          Regular user? <button class="auth-link-btn" data-toggle="auth-tab" data-target="userLoginTab">Sign in here</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Profile Modal -->
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
<script src="assets/js/config.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/api.js"></script>
<script src="assets/js/auth.js"></script>
<script src="assets/js/favorites.js"></script>
<script src="assets/js/admin.js"></script>
<script src="assets/js/ui.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>

