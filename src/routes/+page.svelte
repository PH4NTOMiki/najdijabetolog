<script>
    /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

    // Helper function to generate an array of stars
    function renderStars(/** @type {number} */rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push('filled'); // Fully filled star
            } else if (rating > i - 1 && rating < i) {
                stars.push('half'); // Half-filled star
            } else {
                stars.push('empty'); // Empty star
            }
        }
        return stars;
    }
</script>
<style>@media (max-width: 767px){.hide-last-a-child a:last-child {display: none;}}</style>
<svelte:head><title>Najbolji dijabetolozi u Vašem gradu</title></svelte:head>

<h1 class="text-5xl font-extrabold text-center my-8 text-gray-800 dark:text-gray-300">Otkrijte najbolje dijabetologe u Vašem gradu</h1>

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
        <div class="hide-last-a-child grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.topDoctors.length}
                {#each data.topDoctors as doctor}
                <a href="/doktori/{doctor.id}">
                    <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{doctor.first_name} {doctor.last_name}</h3>
                        <p class="text-gray-600 italic">{doctor.institution.name}</p>
                        <!-- Overall Rating -->
                        <div>
                            <p class="text-yellow-500 font-bold text-xl mb-2">⭐ {doctor.rating.toFixed(1)} - Ukupna ocjena</p>

                            <!-- Ratings by Category -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {#each [
                                    { label: 'Stručnost', rating: doctor.ratingskill },
                                    { label: 'Ljubaznost', rating: doctor.ratingkindness },
                                    { label: 'Etičnost', rating: doctor.ratingethicality },
                                    { label: 'Ustanova', rating: doctor.institution.rating },
                                ] as category}
                                    <div class="text-center">
                                        <p class="text-sm text-gray-600">{category.label}</p>
                                        <div class="flex justify-center space-x-1 mt-1" aria-label={`Rating: ${category.rating} out of 5`}>
                                            {#each renderStars(category.rating) as type}
                                                {#if type === 'half'}
                                                    <!-- Half-Filled Star -->
                                                    <svg
                                                        class="w-6 h-6 text-gray-300"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <defs>
                                                            <clipPath id="half-clip">
                                                                <rect x="0" y="0" width="12" height="24" />
                                                            </clipPath>
                                                        </defs>
                                                        <path
                                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                            clip-path="url(#half-clip)"
                                                            fill="#eab308"
                                                        />
                                                        <path
                                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        />
                                                    </svg>
                                                {:else}
                                                    <!-- Fully or Empty Star -->
                                                    <svg
                                                        class="w-6 h-6 {type === 'filled' ? 'text-yellow-500' : 'text-gray-300'}"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                            fill="{type === 'filled' ? 'currentColor' : 'none'}"
                                                            stroke="currentColor"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        />
                                                    </svg>
                                                {/if}
                                            {/each}
                                        </div>
                                        <p class="text-sm text-gray-600">{category.rating.toFixed(1)}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </a>
                {/each}
            {:else}
                <p class="text-gray-500">Ne možemo pronaći najbolje dijabetologe u Vašem gradu.</p>
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
        <div class="hide-last-a-child grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.popularInstitutions.length}
                {#each data.popularInstitutions as institution}
                <a href="/ustanove/{institution.id}">
                <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{institution.name}</h3>
                        <p class="text-gray-600"><span class="font-semibold">{institution.city.name}</span></p>
                        <p class="mt-2"><span class="underline text-blue-500 hover:text-blue-700">{institution.number_of_doctors} dijabetolog{institution.number_of_doctors!=1?'a':''}</span></p>
                    </div>
                </a>
                {/each}
            {:else}
                <p class="text-gray-500">Ne možemo pronaći najpopularnije ustanove u Vašem gradu.</p>
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
        <div class="hide-last-a-child grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if data.topCities.length}
                {#each data.topCities as city}
                    <div class="p-6 border rounded-lg bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-200">
                        <h3 class="text-2xl font-bold text-gray-800">{city.name}</h3>
                        <p class="text-gray-500 mt-2">{city.institutions} ustanova</p>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500">Ne možemo pronaći najbolje gradove.</p>
            {/if}
        </div>
    </section>-->

</div>