<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

    let searchQuery = $state('');

    function prepareInput(/** @type {string} */str){
        return str.toLowerCase().replaceAll('ž','z').replaceAll('š','s').replaceAll('č','c').replaceAll('ć','c');
    }

    let filteredDoctors = $derived.by(() => {
        if (!searchQuery) return data.doctors.slice();

        const normalizedQuery = prepareInput(searchQuery.trim());
        const queryParts = normalizedQuery.split(/\s+/);

        return data.doctors.filter(doctor => {
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
</script>
<svelte:head><title>Dijabetolozi - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Pronađite najboljeg dijabetologa u Vašem gradu</h1>


    <!-- Search Bar -->
    <div class="flex justify-center mb-8">
        <input
            type="text"
            placeholder="Ime dijabetologa"
            bind:value={searchQuery}
            class="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>

    <!-- Doctors List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if filteredDoctors.length}
            {#each filteredDoctors as doctor}
            <a href={`/dijabetolozi/${doctor.id}`}>
            <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition duration-200">
                    <h2 class="text-xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h2>
                    <p class="text-gray-500">{doctor.institution?.name}</p>
                    <p class="text-yellow-500 font-semibold mt-2">⭐ {doctor.rating.toFixed(1)}</p>
                    <button
                        class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Pogledaj profil dijabetologa
                    </button>
                </div>
                </a>
            {/each}
        {:else}
            <p class="text-gray-500 col-span-full text-center">Ne možemo pronaći dijabetologa po Vašem upitu.</p>
        {/if}
    </div>
</div>
