<template>
  <div class="login-container">
    <div class="login-card">
      <div class="brand-header">
        <h2>Worlds Tracker</h2>
        <p class="subtitle">Management Platform Portal</p>
      </div>

      <form @submit.prevent="handleLoginSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            placeholder="Enter username"
            required
            :disabled="authStore.isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Enter password"
            required
            :disabled="authStore.isLoading"
          />
        </div>

        <!-- ⚠️ Displays error messages straight from your backend if login fails -->
        <p v-if="errorMessage" class="error-msg" role="alert">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleLoginSubmit() {
  errorMessage.value = '';
  
  try {
    const success = await authStore.login(username.value, password.value);
    
    if (success) {
      // 🚀 Success! Redirect straight to your private dashboard/home view
      router.push({ name: 'home' });
    }
  } catch (error: any) {
    // Captures the message sent back by your Express error handlers
    errorMessage.value = error.response?.data?.message || 'Invalid username or password.';
  }
}
</script>

<style scoped lang="scss">
// SCSS Variables
$vue-green: #42b883;
$vue-green-hover: #359f6e;
$bg-card: #1e1e1e;
$bg-input: #2a2a2a;
$border-color: #333;
$error-color: #ff6b6b;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;

  .login-card {
    background: $bg-card;
    padding: 2.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    width: 100%;
    max-width: 400px;
    border: 1px solid #2d2d2d;

    .brand-header {
      text-align: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
        color: #fff;
        font-size: 1.8rem;
      }

      .subtitle {
        margin: 0.25rem 0 0;
        color: #888;
        font-size: 0.9rem;
      }
    }

    .form-group {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;

      label {
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        color: #bbb;
        font-weight: 500;
      }

      input {
        padding: 0.75rem;
        border-radius: 4px;
        border: 1px solid $border-color;
        background: $bg-input;
        color: #fff;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: $vue-green;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: $vue-green;
      color: #1a1a1a;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: $vue-green-hover;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .error-msg {
      color: $error-color;
      font-size: 0.85rem;
      margin: 0.5rem 0;
      background: rgba($error-color, 0.1);
      padding: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid $error-color;
    }
  }
}
</style>