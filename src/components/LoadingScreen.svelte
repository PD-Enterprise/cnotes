<script>
  import { onMount } from 'svelte';
  let messages = [
    "Loading your precious notes… Please don’t panic! ✨",
    "Summoning the note gods…",
    "Untangling your thoughts…",
    "Sharpening virtual pencils…",
    "Counting notes for you…",
    "Almost there, don’t refresh!",
    "If this takes long, try bribing your WiFi!",
    "Did you know? Notes love coffee ☕",
    "Hang tight, your genius is loading…",
    "Pro tip: Staring at the spinner makes it go faster!"
  ];
  let current = 0;
  let message = messages[current];
  let interval;

  // Easter egg state
  let spinnerClicks = 0;
  let showEasterEgg = false;

  function handleSpinnerClick() {
    spinnerClicks++;
    if (spinnerClicks >= 5) {
      showEasterEgg = true;
    }
  }

  onMount(() => {
    interval = setInterval(() => {
      current = (current + 1) % messages.length;
      message = messages[current];
    }, 1200);
    return () => clearInterval(interval);
  });
</script>

<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-200 text-base-content">
  <div class="mb-6 animate-spin-slow cursor-pointer" on:click={handleSpinnerClick} title="Click me for a surprise!">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="text-primary">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>
  </div>
  {#if showEasterEgg}
    <h2 class="text-2xl font-bold mb-2 text-error animate-bounce">🎉 You found the secret! You’re officially a Note Ninja! 🥷</h2>
    <p class="text-lg italic text-accent">Go brag to your friends. Or just keep clicking for fun!</p>
  {:else}
    <h2 class="text-2xl font-bold mb-2 transition-all duration-500">{message}</h2>
    <p class="text-lg italic text-accent">If you see this for too long, blame your WiFi, not us! 😅</p>
  {/if}
</div>

<style>
  .animate-spin-slow {
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
