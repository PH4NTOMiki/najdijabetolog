<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

    // Destructure preloaded data
    let { institutions } = data;

    let searchQuery = $state('');

    // Filter institutions based on search query
    let filteredInstitutions = $derived(institutions.filter(
        (institution) =>
            institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            institution.city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
</script>
<svelte:head><title>Ustanove - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Ustanove</h1>

    <!-- Search Bar -->
    <div class="flex justify-center mb-8">
        <input
            type="text"
            placeholder="Pretražite po imenu ustanove ili gradu u kojem se nalazi"
            bind:value={searchQuery}
            class="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    </div>

    <!-- Institutions List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if filteredInstitutions.length}
            {#each filteredInstitutions as institution}
            <a href={`/ustanove/${institution.id}`}>
                <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition duration-200">
                    <h2 class="text-xl font-bold text-gray-800">{institution.name}</h2>
                    <p class="text-gray-600">{institution.city.name}</p>
                    <p class="text-gray-500 mt-2">{institution.doctors} doktora</p>
                    <button
                        class="inline-block mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Detalji
                    </button>
                </div>
            </a>
            {/each}
        {:else}
            <p class="text-gray-500 col-span-full text-center">No institutions found.</p>
        {/if}
    </div>
</div>
