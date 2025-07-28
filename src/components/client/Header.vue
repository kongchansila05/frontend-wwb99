<template>
    <nav class="navbar navbar-expand-lg shadow-sm header">
        <div class="container">
            <!-- Logo -->
            <router-link to="/" class="navbar-brand">
                <img src="https://wwb99.news/wp-content/uploads/2025/04/WWB99.png" alt="WWB99 Logo" height="80"
                    class="d-inline-block align-text-top" />
          </router-link>

            <!-- Toggler for mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"
                aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Menu and buttons -->
            <div class="collapse navbar-collapse" id="navbarMain">
                <!-- Left Menu -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" exact-active-class="active">
                            ទំព័រដើម
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/livescore" class="nav-link" exact-active-class="active">
                            ពិន្ទុបាល់
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/news" class="nav-link" exact-active-class="active">
                            មាតិកា
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/highlights" class="nav-link" exact-active-class="active">
                            ហាយឡាយ
                        </router-link>
                    </li>

                </ul>

                <!-- Right Buttons -->
                <div class="d-flex gap-2">
                    <div class="btn fw-bold bg-primary rounded-circle">
                        <i class="bi bi-globe" style="font-size: 20px;"></i>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>