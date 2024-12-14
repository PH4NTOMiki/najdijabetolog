<script>
  import "../app.css";
  import { user, logout } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { fetchCache } from "$lib/db";
  import { LogOut } from "lucide-svelte";
	import { onMount } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  /** @type {App.Doctor[]} */
  let doctors = $state([]); // Local variable for doctors
  let searchQuery = $state(''); // Local search query state

  async function handleLogout() {
    await logout();
    goto('/upravljanje/prijava');
  }

  function handleSelection(doctor) {
    searchQuery = '';
    goto(`/doctors/${doctor.id}`);
  }

  // Filter doctors based on search query
  function getFilteredDoctors() {
    if (!searchQuery) return [];
    return doctors.filter(doctor =>
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Render star ratings
  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('filled'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }
  onMount(()=>{
    fetch('/api/doctors')
      .then(response => response.json())
      .then(data => {
        doctors = data; // Update local doctors variable
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  });
</script>

<svelte:head>
  <title>Najdijabetolog</title>
  {#if fetchCache}
    <template id="loaded-data" style="display:none">{browser ? '' : Buffer.from(JSON.stringify(fetchCache)).toString('base64')}</template>
  {/if}
</svelte:head>

<!-- Navbar -->
<div class="navbar bg-[#ff8282] text-[black] flex-wrap">
  <div class="navbar-start">
    <a href={$user ? `/upravljanje` : `/`} class="btn btn-ghost text-xl">Najdijabetolog</a>
  </div>

  <!-- Search Dropdown for Doctors -->
  <div class="navbar-end flex-grow flex flex-col items-end md:flex-row md:items-center md:space-x-4">
    <div class="relative w-full max-w-sm md:max-w-md">
      <input
        type="text"
        placeholder="Pronađite dijabetologa"
        class="input input-bordered input-sm w-full"
        bind:value={searchQuery}
      />
      {#if getFilteredDoctors().length > 0}
        <div class="absolute z-10 w-full mt-1 bg-white shadow rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
          {#each getFilteredDoctors() as doctor}
            <div
              class="p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between space-x-4"
              onclick={() => handleSelection(doctor)}
            >
              <!-- Doctor Name -->
              <div class="flex items-center space-x-2">
                <span class="text-yellow-500">👨‍⚕️</span>
                <span>{doctor.first_name} {doctor.last_name}</span>
              </div>
              
              <!-- Doctor Star Rating -->
              <div class="flex space-x-1" aria-label={`Rating: ${doctor.rating} out of 5`}>
                {#each renderStars(doctor.rating) as star}
                  <svg
                    class="w-4 h-4 {star === 'filled' ? 'text-yellow-500' : star === 'half' ? 'text-yellow-500' : 'text-gray-300'}"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="{star === 'filled' ? 'currentColor' : star === 'half' ? 'currentColor' : 'none'}"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="{star === 'half'
                        ? 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2v15.27z'
                        : 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'}"
                    />
                  </svg>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if $page.url.pathname.startsWith('/upravljanje') && $user}
      {#if $user.role === 'admin'}
        <a href="/upravljanje/korisnici" class="btn btn-ghost text-xl">Korisnici</a>
      {/if}
      <h1 class="font-bold">Dobrodošli, {$user.username}!</h1>&nbsp;&nbsp;
      <button onclick={handleLogout} class="btn btn-secondary">
        <LogOut class="mr-2" size={18} />Odjava
      </button>
    {/if}
  </div>
</div>

{@render children?.()}
