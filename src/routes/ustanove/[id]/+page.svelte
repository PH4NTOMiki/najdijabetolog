<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
    let { institution, doctors } = data;
</script>
<svelte:head><title>{institution.name} - Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<div class="container mx-auto px-4 py-12">
    <!-- Institution Details -->
    <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-800">{institution.name}</h1>
        <p class="text-gray-600 text-lg">{institution.city.name}</p>
        <p class="text-gray-600 text-lg">{institution.bio}</p>
        <p class="text-yellow-500 font-bold text-xl mt-2">⭐ {institution.rating.toFixed(1)}</p>
    </div>

    <!-- Doctors List -->
    <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Dijabetolozi u ustanovi {institution.name}</h2>

        {#if doctors.length}
            <div class="space-y-6">
                {#each doctors as doctor}
                <a href={`/doktori/${doctor.id}`}>
                    <div class="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
                        <h3 class="text-2xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h3>
                        <p class="text-yellow-500 font-bold text-lg">⭐ {doctor.rating.toFixed(1)}</p>
                        <button
                            class="block mt-4 text-blue-600 hover:underline"
                        >
                            Otvori profil
                        </button>
                    </div>
                </a>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">Ova ustanova još nema dijabetologa.</p>
        {/if}
    </div>
</div>
