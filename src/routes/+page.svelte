<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
    let { topDoctors, popularInstitutions, topCities } = data;
</script>
<svelte:head><title>Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<h1 class="text-5xl font-extrabold text-center my-8 text-gray-800">Otkrijte najbolje dijabetologe u Vašem gradu</h1>

<div class="container mx-auto px-4 space-y-16">

    <!-- Top Doctors Section -->
    <section class="bg-blue-50 rounded-lg py-8 px-6 shadow-lg">
        <a href="/doktori">
        <h2 class="text-3xl font-semibold text-blue-600 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 16c4.418 0 8 3.582 8 8H4c0-4.418 3.582-8 8-8z" />
            </svg>
            Najbolji dijabetolozi
        </h2>
        </a>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if topDoctors.length}
                {#each topDoctors as doctor}
                <a href="/doktori/{doctor.id}">
                    <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h3>
                        <p class="text-gray-600 italic">{doctor.institution.name}</p>
                        <p class="text-yellow-500 font-semibold mt-2">⭐ {doctor.rating.toFixed(1)}</p>
                    </div>
                </a>
                {/each}
            {:else}
                <p class="text-gray-500">No doctors available.</p>
            {/if}
        </div>
    </section>

    <!-- Popular Hospitals Section -->
    <section class="bg-green-50 rounded-lg py-8 px-6 shadow-lg">
        <a href="/ustanove">
        <h2 class="text-3xl font-semibold text-green-600 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 0 0-2 2v14h6v-4h6v4h6V5a2 2 0 0 0-2-2zm0 16h-4v-4H9v4H5V5h14v14zM7 7h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2z" />
            </svg>
            Najpopularnije ustanove
        </h2>
        </a>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if popularInstitutions.length}
                {#each popularInstitutions as institution}
                <a href="/ustanove/{institution.id}">
                <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{institution.name}</h3>
                        <p class="text-gray-600"><span class="font-semibold">{institution.city.name}</span></p>
                        <p class="text-gray-500 mt-2">{institution.number_of_doctors} dijabetologa</p>
                    </div>
                </a>
                {/each}
            {:else}
                <p class="text-gray-500">No hospitals available.</p>
            {/if}
        </div>
    </section>

    <!-- Top Cities Section -->
    <!--<section class="bg-purple-50 rounded-lg py-8 px-6 shadow-lg">
        <h2 class="text-3xl font-semibold text-purple-600 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 1 10 10v10H2V12a10 10 0 0 1 10-10zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-11V6h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
            </svg>
            Najbolji gradovi
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if topCities.length}
                {#each topCities as city}
                    <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{city.name}</h3>
                        <p class="text-gray-500 mt-2">{city.institutions} ustanova</p>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500">No cities available.</p>
            {/if}
        </div>
    </section>-->

</div>