<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

    // Destructure preloaded data
    let { institutions } = data;

    let searchQuery = $state('');

    // Filter institutions based on search query
    $: filteredInstitutions = $derived(institutions.filter(
        (institution) =>
            institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            institution.city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
</script>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Explore Institutions</h1>

    <!-- Search Bar -->
    <div class="flex justify-center mb-8">
        <input
            type="text"
            placeholder="Search by name or location"
            bind:value={searchQuery}
            class="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    </div>

    <!-- Institutions List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if filteredInstitutions.length}
            {#each filteredInstitutions as institution}
                <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition duration-200">
                    <h2 class="text-xl font-bold text-gray-800">{institution.name}</h2>
                    <p class="text-gray-600">{institution.city.name}</p>
                    <p class="text-gray-500 mt-2">{institution.doctors} doctors available</p>
                    <a
                        href={`/institutions/${institution.id}`}
                        class="inline-block mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                    >
                        View Details
                    </a>
                </div>
            {/each}
        {:else}
            <p class="text-gray-500 col-span-full text-center">No institutions found.</p>
        {/if}
    </div>
</div>
