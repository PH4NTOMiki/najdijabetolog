<script>
  import "../app.css";
  import { user, logout } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { fetchCache } from "$lib/db";
  import { LogOut, Menu, X, Search } from "lucide-svelte";
  import { onMount } from "svelte";

  /** @type {Props} */
  let { children } = $props();

  /** @type {App.Doctor[]} */
  let doctors = $state([]);
  let searchQuery = $state('');
  let isMenuOpen = $state(false);
  let isSearchVisible = $state(false); // New state for search bar visibility

  async function handleLogout() {
    await logout();
    goto('/upravljanje/prijava');
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function toggleSearch() {
    isSearchVisible = !isSearchVisible;
  }

  function handleMobileNavClick(path) {
    isMenuOpen = false;
    goto(path);
  }

  function prepareInput(/** @type {string} */str){
    return str.toLowerCase().replaceAll('ž','z').replaceAll('š','s').replaceAll('č','c').replaceAll('ć','c');
  }

  let searchResults = $derived.by(() => {
    if (!searchQuery.trim()) return [];

    const normalizedQuery = prepareInput(searchQuery.trim());
    const queryParts = normalizedQuery.split(/\s+/);

    return doctors.filter(doctor => {
      const fullName1 = prepareInput(`${doctor.first_name} ${doctor.last_name}`);
      const fullName2 = prepareInput(`${doctor.last_name} ${doctor.first_name}`);

      // Check if the query matches any name combination or a part of it
      return (
        fullName1.includes(normalizedQuery) ||
        fullName2.includes(normalizedQuery) ||
        queryParts.every(part => 
          prepareInput(doctor.first_name).includes(part) ||
          prepareInput(doctor.last_name).includes(part)
        )
      );
    });
  });

  function renderStars(/** @type {number} */rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('filled'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }

  onMount(() => {
    // @ts-ignore
    window.goto = goto;
    fetch('/api/doctors')
      .then(response => response.json())
      .then(data => {
        doctors = data;
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

<div class="navbar bg-[#e8f5e9] text-[black] p-2">
  <div class="w-full flex flex-wrap gap-2 items-center">
    <!-- Logo and Search Icon (Mobile) -->
    <div class="flex flex-1 items-center gap-2 min-w-0">
      <a href={$user ? `/upravljanje` : `/`} class="max-w-[75%] lg:max-w-96">
        <img src="https://storage.mikitvba.com/2b65dda3-d847-41e1-943c-26f547b1855f.png" alt="Logo" />
      </a>
    </div>

    <!-- Search Icon (Mobile) -->
    <div class="flex items-center gap-2 lg:hidden">
      <button onclick={toggleSearch} aria-label="Search">
        <Search size={24} />
      </button>
      <!-- Hamburger menu button for mobile -->
      <button class="btn btn-ghost pl-[0.1rem] pr-[0.1rem]" onclick={toggleMenu} aria-label="Menu">
        {#if isMenuOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    </div>

    <!-- Desktop navigation and Search Bar -->
    <div class="hidden lg:flex items-center gap-4">
      <a href="/o-nama" class="btn btn-ghost">O nama</a>
      <a href="/kontakt" class="btn btn-ghost">Kontakt</a>
      <a href="/prijavi-gresku" class="btn btn-ghost">Prijavi grešku</a>

      <!-- Search Bar -->
      <div class="flex-1 min-w-0 ml-4">
        <div class="w-full max-w-md">
          <input
            type="text"
            placeholder="Pronađite dijabetologa"
            class="input input-bordered input-sm w-full"
            bind:value={searchQuery}
          />
          {#if searchResults.length > 0}
            <div class="absolute z-10 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-48 overflow-y-auto w-full max-w-md">
              {#each searchResults as doctor}
                <a href="/dijabetolozi/{doctor.id}"
                  class="w-full p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between space-x-4"
                  onclick={() => { searchQuery = '' }}
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-yellow-500">👨‍⚕️</span>
                    <span>{doctor.first_name} {doctor.last_name}</span>
                  </div>
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
                </a>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>

    {#if $page.url.pathname.startsWith('/upravljanje') && $user}
      <div class="flex flex-wrap items-center justify-end gap-2 ml-auto">
        {#if $user.role === 'admin'}
          <a href="/upravljanje/korisnici" class="btn btn-ghost text-xl">Korisnici</a>
        {/if}
        <h1 class="font-bold">Dobrodošli, {$user.username}!</h1>
        <button onclick={handleLogout} class="btn btn-secondary">
          <LogOut class="mr-2" size={18} />Odjava
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- Mobile Search Bar -->
{#if isSearchVisible}
  <div class="lg:hidden w-full p-2 bg-[#e8f5e9]">
    <input
      type="text"
      placeholder="Pronađite dijabetologa"
      class="input input-bordered input-sm w-full"
      bind:value={searchQuery}
    />
    {#if searchResults.length > 0}
      <div class="fixed inset-x-0 z-10 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-48 overflow-y-auto mx-2">
        {#each searchResults as doctor}
          <a href="/dijabetolozi/{doctor.id}"
            class="w-full p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between space-x-4"
            onclick={() => { searchQuery = '' }}
          >
            <div class="flex items-center space-x-2">
              <span class="text-yellow-500">👨‍⚕️</span>
              <span>{doctor.first_name} {doctor.last_name}</span>
            </div>
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
          </a>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<!-- Mobile menu -->
{#if isMenuOpen}
  <nav class="lg:hidden fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50" onclick={toggleMenu}></div>
    
    <!-- Menu content -->
    <div class="relative bg-white w-[18rem] h-full shadow-lg p-4">
      <div class="flex flex-col gap-4">
        <button 
          class="btn btn-ghost w-full justify-start"
          onclick={() => handleMobileNavClick('/o-nama')}
        >
          O nama
        </button>
        <button 
          class="btn btn-ghost w-full justify-start"
          onclick={() => handleMobileNavClick('/kontakt')}
        >
          Kontakt
        </button>
        <button 
          class="btn btn-ghost w-full justify-start"
          onclick={() => handleMobileNavClick('/prijavi-gresku')}
        >
          Prijavi grešku
        </button>
      </div>
    </div>
  </nav>
{/if}

{@render children?.()}