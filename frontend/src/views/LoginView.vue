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
.login-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background:
    radial-gradient(circle at 10% 20%, rgba(222, 74, 74, 0.12), transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(51, 65, 85, 0.16), transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);

  .login-card {
    width: 100%;
    max-width: 430px;
    padding: 2.5rem;
    border-radius: 18px;
    border: 1px solid rgba(100, 116, 139, 0.24);
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(8px);
    box-shadow: 0 24px 50px rgba(30, 41, 59, 0.18);

    .brand-header {
      text-align: center;
      margin-bottom: 1.8rem;

      h2 {
        color: var(--dark);
        font-size: 1.75rem;
        letter-spacing: 0.02em;
      }

      .subtitle {
        margin-top: 0.35rem;
        color: var(--grey);
        font-size: 0.92rem;
      }
    }

    .form-group {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;

      label {
        margin-bottom: 0.45rem;
        color: var(--dark-alt);
        font-size: 0.85rem;
        font-weight: 600;
      }

      input {
        height: 44px;
        padding: 0 0.8rem;
        border: 1px solid rgba(100, 116, 139, 0.35);
        border-radius: 9px;
        background: #fff;
        color: var(--dark);
        font-size: 0.96rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(222, 74, 74, 0.2);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }

    button {
      width: 100%;
      margin-top: 0.8rem;
      height: 46px;
      border-radius: 10px;
      background: linear-gradient(180deg, rgba(222, 74, 74, 1) 0%, rgba(198, 58, 58, 1) 100%);
      color: #fff;
      font-size: 0.98rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 22px rgba(222, 74, 74, 0.35);
        filter: brightness(1.03);
      }

      &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
    }

    .error-msg {
      margin-top: 0.45rem;
      border-left: 3px solid var(--primary);
      border-radius: 7px;
      padding: 0.55rem 0.7rem;
      background: rgba(222, 74, 74, 0.09);
      color: #b02f2f;
      font-size: 0.84rem;
    }
  }

  @media (max-width: 560px) {
    padding: 1rem;

    .login-card {
      padding: 1.5rem;
      border-radius: 14px;
    }
  }
}
</style>