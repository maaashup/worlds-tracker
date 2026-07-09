<template>
    <aside :class="`${isMenuOpen && 'is-open'}`">
        <div class="logo">
            <img src="@/assets/logo.svg" alt="Vue Logo" />
            <span class="logo-text">World's Tracker</span>
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle">
                <span class="material-symbols-outlined" @click="ToggleMenu">double_arrow</span>
            </button>
        </div>

        <h3>Menu</h3>
        <div class="menu">
            <router-link class="button" to="/">
                <span class="material-symbols-outlined">home</span>
                <span class="text">Dashboard</span>
            </router-link>
            <router-link class="button" to="/events">
                <span class="material-symbols-outlined">event</span>
                <span class="text">Events</span>
            </router-link>
            <router-link class="button" to="/info">
                <span class="material-symbols-outlined">info</span>
                <span class="text">About</span>
            </router-link>
        </div>

        <div class="flex"></div>

        <div class="menu">
            <router-link class="button" to="/settings">
                <span class="material-symbols-outlined">settings</span>
                <span class="text">Settings</span>
            </router-link>
            
            <button class="button logout-btn" type="button" @click="handleLogout">
                <span class="material-symbols-outlined">logout</span>
                <span class="text">Logout</span>
            </button>
        </div>
    </aside>

</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { API_PATH } from "@/services/api-path";
import { type AxiosInstance } from "axios";

const api = inject("$api") as AxiosInstance;
const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(localStorage.getItem("isMenuOpen") === "true");

const ToggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    localStorage.setItem("isMenuOpen", isMenuOpen.value.toString());
};

const handleLogout = async () => {
    try {
        // 1. Dispatch clear cookie call to backend
        await authStore.logout();
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        router.push({ name: 'login' });
    }
};

</script>

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
    width: calc(2rem + 32px);
    overflow: hidden;
    min-height: 100vh;
    padding: 1rem;

    background-color: var(--dark);
    color: var(--light);

    transition: 0.2s ease-out;

    .flex {
        flex: 1 1 0;
    }

    .logo {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        overflow: hidden; //Prevent text from visibly sliding underneath

        img {
            width: 2rem;
            margin-right: 0;
            transition: margin 0.3s ease-out;
        }

        .logo-text {
            display: inline-block; //Not using "none", instead using inline-block. This way we can animate on it rather than the text disappearing.
            flex: 0 0 auto; //This is cool, this prevents the element from changing its original size. It maintains its exact dimensions regardless of avail space in flex container.
            max-width: 0;
            overflow: hidden;
            white-space: nowrap;
            opacity: 0;
            margin-left: 0;
            transition: max-width 0.35s ease, opacity 0.2s ease 0.1s, margin 0.35s ease;
        }
    }

    .menu-toggle-wrap {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;

        position: relative;
        top: 0;
        transition: 0.2s ease-out;

        .menu-toggle {
            transition: 0.2s ease-out;

            .material-symbols-outlined {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover {
                .material-symbols-outlined {
                    color: var(--primary);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    h3,
    .button .text {
        opacity: 0;
        transition: 0.3s ease-out;
    }

    h3 {
        color: var(--grey);
        font-size: 0.87rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .menu {
        margin: 0 -1rem;

        .button {
            display: flex;
            align-items: center;
            text-decoration: none;

            padding: 0.5rem 1rem;
            transition: 0.2s ease-out;

            .material-symbols-outlined {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            .text {
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover, &.router-link-exact-active {
                background-color: var(--dark-alt);

                .material-symbols-outlined,
                .text {
                    color: var(--primary);
                }
            }

            &.router-link-exact-active {
                border-right: 5px solid var(--primary);
            }
        }

        .logout-btn:hover {
            background-color: var(--dark-alt);
            
            .material-symbols-outlined,
            .text {
                color: #ef4444;
            }
        }
    }

    &.is-open {
        width: var(--sidebar-width);

        .menu-toggle-wrap {
            top: -3rem;

            .menu-toggle {
                transform: rotate(-180deg);
            }
        }

        h3,
        .button .text {
            opacity: 1;
        }

        .button {
            .material-symbols-outlined {
                margin-right: 1rem;
            }
        }

        .logo-text {
            max-width: 180px;
            opacity: 1;
            margin-left: 1rem;
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
}
</style>